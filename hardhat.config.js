require("@nomicfoundation/hardhat-toolbox");
require("@nomicfoundation/hardhat-ethers");
require("dotenv").config();

require("./utils/HuffCompiler");
require("./utils/YulCompiler");

const rpc_url = process.env.RPC_URL;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY;
const RPC = process.env.RPC;

module.exports = {
  solidity: "0.8.26",
  networks: {
    hardhat: {
      forking: {
        url: RPC,
        accounts: [PRIVATE_KEY],
      },
      chainId: 1,
    },
    mainnet: {
      url: RPC,
      accounts: [PRIVATE_KEY],
    },
    sepolia: {
      url: rpc_url,
      accounts: [PRIVATE_KEY],
    },
  },
  etherscan: {
    apiKey: ETHERSCAN_API_KEY,
  },
  gasReporter: {
    enabled: true,
  },

  // ABI for Huff contracts
  huff_artifacts: {
    Storage: {
      abi: [
        {
          inputs: [],
          name: "getValue",
          outputs: [
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "num",
          outputs: [
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "_num",
              type: "uint256",
            },
          ],
          name: "setValue",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
      ],
    },
    Whitelist: {
      abi: [
        {
          inputs: [],
          name: "AlreadyInWhitelist",
          type: "error",
        },
        {
          inputs: [],
          name: "MaxWhitelistedAddressesLimit",
          type: "error",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: false,
              internalType: "address",
              name: "sender",
              type: "address",
            },
          ],
          name: "AddedToWhitelist",
          type: "event",
        },
      ],
    },
  },

  // ABI for YUL contracts
  yulArtifacts: {
    Whitelist: {
      abi: [
        {
          inputs: [],
          name: "AlreadyInWhitelist",
          type: "error",
        },
        {
          inputs: [],
          name: "MaxWhitelistedAddressesLimit",
          type: "error",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: false,
              internalType: "address",
              name: "sender",
              type: "address",
            },
          ],
          name: "AddedToWhitelist",
          type: "event",
        },
      ],
    },
  },
};
