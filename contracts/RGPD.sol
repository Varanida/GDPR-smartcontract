pragma solidity ^0.4.23;

contract RGPD {

  struct structSignature {
    uint8 v;
    bytes32 r;
    bytes32 s;
  }

  mapping(address => mapping(address => structSignature)) optIn;

  function write(address _u_addr, uint8 _v, bytes32 _r, bytes32 _s) public {
    optIn[msg.sender][_u_addr] = structSignature({v:_v, r:_r, s:_s});
  }

  function remove(address _u_addr) public {
    delete optIn[msg.sender][_u_addr];
  }

  function verify(address _u_addr, address _c_addr, bytes32 hash) public view returns(bool) {
    structSignature storage sig = optIn[_c_addr][_u_addr];
    return ecrecover(hash, sig.v, sig.r, sig.s) == _u_addr;
  }

}
