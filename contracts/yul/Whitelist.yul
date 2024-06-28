/* Storage_SLOT
    mapping(address => bool) - 0x00
    uint256 numAddressesWhitelisted - 0x01
*/

object "Whitelist" {
    code {
        datacopy(0, dataoffset("runtime"), datasize("runtime"))
        return(0, datasize("runtime")) 
    }
    object "runtime" {
        code {
            switch selector()
            /* Storage */
            case 0x8e7314d9 /* "addAddressToWhitelist()" */ {
                mstore(0x40, 10)
                return(0x40, 0x20)
            }
            /* View */
            case 0x06c933d8 /* "whitelistedAddresses(address)" */ {
                mstore(0x00, shr(0x60, calldataload(0x04)))
                mstore(0x00, sload(keccak256(0x00, 0x40)))
                return(0x00, 0x20)
            }
            case 0x4011d7cd /* "numAddressesWhitelisted()" */ {
                mstore(0x00, sload(0x01))
                return(0x00, 0x20)
            }
            case 0x31a72188 /* "maxWhitelistedAddresses()" */ {
                mstore(0x00, 0x0a)
                return(0x00, 0x20)
            }
            default {
                revert(0x00, 0x01)
            }

            /* HELPERS */
            function selector() -> s {
                s := div(calldataload(0), 0x100000000000000000000000000000000000000000000000000000000)
            }
        }
    }
}
