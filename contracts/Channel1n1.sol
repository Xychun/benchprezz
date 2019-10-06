pragma solidity ^0.5.7;
pragma experimental ABIEncoderV2;

import "./ECRecovery.sol";

/// @author Julian Sakowski
/// @title A prototype state channel contract
contract Channel1n1 is ECRecovery{

  enum Status { IDLE, CONNECTING, CONNECTED, RELEASED }

  struct StateVector {
    Status status;
    uint256 nonce;
    int32 latitude; // in DD(Decimal Degrees) - xx.xxxxx between 90 and -90
    int32 longitude; // in DD(Decimal Degrees) - xx.xxxxx between 180 and -180
    uint16 direction; // in degrees
    uint16 speed; // in km/h
    int8 acceleration; // in m/s^2
  }

  struct Channel {
    StateVector stateCar1;
    StateVector stateCar2;
    address car1;
    address car2;
    address firstCloseApproval;
    uint256 startingBlock;
    bool closed;
  }

  Channel[] public channels;

  event OnOpenChannel(uint256 channelId, address indexed car);
  event OnJoinChannel(uint256 channelId, address indexed car, uint256 startingBlock);
  event OnCloseChannel(uint256 indexed channelId, address indexed car, bool closed);

  /// @dev Car1 opens a channel and waits for car2 to join
  function openChannel() public payable {
    uint256 _channelId = channels.length;
    channels.length++;

    // setup stateVector
    StateVector memory stateVector = StateVector(Status.CONNECTING, 0, 4624644, 1435776, 0, 232, 1);

    // setup channel
    Channel storage channel = channels[_channelId];
    channel.car1 = msg.sender;
    channel.stateCar1 = stateVector;

    emit OnOpenChannel(_channelId, msg.sender);
  }

  /// @dev Car2 joins an already opened channel
  function joinChannel(uint256 _channelId) public payable {
    require(_channelId < channels.length,
      "ChannelID does not exist");
    require(
      (channels[_channelId].car1 != msg.sender) &&
      (channels[_channelId].car1 != address(0)) &&
      (channels[_channelId].car2 == address(0)),
      "This channel is full or not initialized correctly");

    Channel storage channel = channels[_channelId];

    // setup stateVector
    StateVector memory stateVector = StateVector(Status.CONNECTED, 0, 4815069, 1158020, 75, 75, -1);

    // setup channel
    channel.car2 = msg.sender;
    channel.stateCar1.status = Status.CONNECTED;
    channel.stateCar2 = stateVector;
    channel.startingBlock = block.number;

    emit OnJoinChannel(_channelId, msg.sender, channel.startingBlock);
  }

  /// @dev Closes the channel, both cars must call this for it to be succesfully closed
  function closeChannel(
    uint256 _channelId,
    bytes memory _sig,
    uint8 _status,
    uint256 _nonce,
    int32 _latitude,
    int32 _longitude,
    uint16 _direction,
    uint16 _speed,
    int8 _acceleration
  )
  public
  {
    Channel storage channel = channels[_channelId];
    require(_status == 3, "The car needs to have been released before closing a channel");
    require(channel.car1 == msg.sender || channel.car2 == msg.sender, "Only a participant is allowed to close this Channel");
    require(!channel.closed, "This channel is closed already");
    require(msg.sender != channel.firstCloseApproval, "This participant already closed the channel and requires the opponent to close as well");
    
    address _secondCar = (channel.car1 == msg.sender) ? channel.car2 : channel.car1;

    bytes32 _hash = keccak256(abi.encode(_channelId, msg.sender, _status, _nonce, _latitude, _longitude, _direction, _speed, _acceleration));
    bytes32 _hashKeccak = keccak256(abi.encodePacked("\x19Ethereum Signed Message:\n32", _hash));

    require(recover(_hashKeccak, _sig) == _secondCar, "The signer is incorrect");

    // one car already approved to close
    if (channel.firstCloseApproval != address(0)) {
      channel.closed = true;
    } else { // the first time close is called on this channel
      channel.firstCloseApproval = msg.sender;
    }

    emit OnCloseChannel(_channelId, msg.sender, channel.closed);
  }

  /// @dev Returns all channels
  function getChannels() public view returns(Channel[] memory chans){
    return channels;
  }
}