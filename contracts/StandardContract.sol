pragma solidity ^0.5.7;

contract StandardContract {

    mapping(address => StateVector) public addressToStateVector_;

    struct StateVector {
        int32 latitude; // in DD(Decimal Degrees) - xx.xxxxx between 90 and -90
        int32 longitude; // in DD(Decimal Degrees) - xx.xxxxx between 180 and -180
        uint16 direction; // in degrees
        uint16 speed; // in km/h
        int8 acceleration; // in m/s^2
    }

  function updateState(int32 _latitude, int32 _longitude, uint16 _direction, uint16 _speed, int8 _acceleration) public {
      StateVector memory stateVector = StateVector(_latitude, _longitude, _direction, _speed, _acceleration);
      addressToStateVector_[msg.sender] = stateVector;
  }
}

