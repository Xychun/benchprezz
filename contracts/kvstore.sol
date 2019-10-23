pragma solidity ^0.5.7;

contract KVstore {

  mapping(string=>string) public store;

  function get(string memory key) public view returns(string memory) {
    return store[key];
  }
  function set(string memory key, string memory value) public {
    store[key] = value;
  }
}