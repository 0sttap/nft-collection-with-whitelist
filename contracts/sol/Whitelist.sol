// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

contract Whitelist {
    uint256 public constant MAX_WHITELISTED_ADDRESSES = 10;
    uint256 public numAddressesWhitelisted;

    mapping(address => bool) public whitelistedAddresses;

    event AddedToWhitelist(address indexed sender);

    error AlreadyInWhitelist();
    error MaxWhitelistedAddressesLimit();

    function addAddressToWhitelist() external {
        if (whitelistedAddresses[msg.sender]) revert AlreadyInWhitelist();
        if (numAddressesWhitelisted == MAX_WHITELISTED_ADDRESSES) revert MaxWhitelistedAddressesLimit();
        
        whitelistedAddresses[msg.sender] = true;

        unchecked { numAddressesWhitelisted++; }

        emit AddedToWhitelist(msg.sender);
    }

}