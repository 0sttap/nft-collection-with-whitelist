// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.26;

contract StorageS {
    uint256 public num;

    // Interface
    function setValue(uint256 _num) external {
        num = _num;
    }

    function getValue() external view returns (uint256) {
        return num;
    }
}
