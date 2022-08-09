// SPDX-License-Identifier: MIT OR Apache-2.0
pragma solidity ^0.8.11;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract PayModel is ReentrancyGuard {
    function Transfer(address payable _to) public payable {
        _to.transfer(msg.value);
    }
}
