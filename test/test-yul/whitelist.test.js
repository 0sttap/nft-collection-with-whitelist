const { ethers } = require("hardhat");
const { expect } = require("chai");

describe("Whitelist Yul test", function () {
  let deployer;
  let whitelist;

  const maxWhitelistedAddresses = 10n;

  // Interface
  const addAddressToWhitelist_sig = "0x8e7314d9";
  const whitelistedAddresses_sig = "0x06c933d8";
  const numAddressesWhitelisted_sig = "0x4011d7cd";
  const MAX_WHITELISTED_ADDRESSES_SIG = "0x31a72188";

  let numAddressesWhitelisted = 0n;

  before(async function () {
    [deployer] = await ethers.getSigners();

    const ContrFactory = await ethers.getContractFactory(
      "Whitelist.yul:Whitelist"
    );

    whitelist = await ContrFactory.deploy();
  });

  it("Should return max whitelisted addresses", async function () {
    const result = await callTx(MAX_WHITELISTED_ADDRESSES_SIG);

    expect(BigInt(result)).to.eq(maxWhitelistedAddresses);
  });

  it("Should return num whitelisted addresses", async function () {
    const result = await callTx(numAddressesWhitelisted_sig);

    expect(BigInt(result)).to.eq(numAddressesWhitelisted);
  });

  it("Should return false while check `isWhitelisted`", async function () {
    const result = await callTx(whitelistedAddresses_sig, deployer);

    expect(Boolean(BigInt(result))).to.be.false;
  });

  it("Should revert if signature not exist", async function () {
    await expect(callTx("0x12345678")).to.be.reverted;
  });

//   describe("#addAddressToWhitelist", function () {
//     it("Should add address to whitelist", async function () {
//       const tx = await callTx(addAddressToWhitelist_sig);

//       await expect(tx)
//         .to.emit(whitelist, "AddedToWhitelist")
//         .withArgs(deployer.address);

//       numAddressesWhitelisted += 1n;

//       const num = await callTx(numAddressesWhitelisted_sig);
//       expect(BigInt(num)).to.eq(numAddressesWhitelisted);

//       const isWhitelisted = await callTx(whitelistedAddresses_sig, deployer);

//       expect(Boolean(BigInt(isWhitelisted))).to.be.true;
//     });

//     it("Should revert if already in whitelist", async function () {
//       await expect(
//         callTx(addAddressToWhitelist_sig)
//       ).to.be.revertedWithCustomError(whitelist, "AlreadyInWhitelist");
//     });

//     it("Should revert if all whitelist slots reserved", async function () {
//       const freeSlot = maxWhitelistedAddresses - numAddressesWhitelisted;

//       let user;
//       for (let i = 0; i < freeSlot; i++) {
//         user = await getRandomUser();
//         await callTx(addAddressToWhitelist_sig, user);
//         numAddressesWhitelisted += 1n;
//       }

//       const num = await callTx(numAddressesWhitelisted_sig);
//       expect(BigInt(num)).to.eq(numAddressesWhitelisted);

//       user = await getRandomUser();

//       await expect(
//         callTx(addAddressToWhitelist_sig, user)
//       ).to.be.revertedWithCustomError(
//         whitelist,
//         "MaxWhitelistedAddressesLimit"
//       );
//     });
//   });

  const getRandomUser = async () => {
    let user = ethers.Wallet.createRandom();
    user = user.connect(ethers.provider);

    await deployer.sendTransaction({
      to: user.address,
      value: ethers.parseEther("0.1"),
    });

    return user;
  };

  const callTx = async (sig, sender = 0) => {
    const data =
       sender && sig != addAddressToWhitelist_sig
        ? ethers.solidityPacked(["bytes4", "address"], [sig, sender.address])
        : ethers.solidityPacked(["bytes4"], [sig]);

    const tx = {
      to: whitelist.target,
      data: data,
    };

    if (sender == 0) sender = deployer;

    const result =
      sig == addAddressToWhitelist_sig
        ? await sender.sendTransaction(tx)
        : await sender.provider.call(tx);

    return result;
  };
});
