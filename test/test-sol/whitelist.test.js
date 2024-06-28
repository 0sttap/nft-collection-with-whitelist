const { ethers } = require("hardhat");
const { expect } = require("chai");

describe("Whitelist test", function () {
  let deployer;
  let whitelist;

  const maxWhitelistedAddresses = 10n;

  describe("#addAddressToWhitelist", function () {
    let numAddressesWhitelisted = 0n;

    before(async function () {
      [deployer] = await ethers.getSigners();

      const ContrFactory = await ethers.getContractFactory("contracts/sol/Whitelist.sol:Whitelist");
      whitelist = await ContrFactory.deploy();
    });

    it("Should add address to whitelist", async function () {
      const tx = await whitelist.addAddressToWhitelist();

      await expect(tx)
        .to.emit(whitelist, "AddedToWhitelist")
        .withArgs(deployer.address);

      numAddressesWhitelisted += 1n;

      expect(await whitelist.numAddressesWhitelisted()).to.eq(
        numAddressesWhitelisted
      );

      expect(await whitelist.whitelistedAddresses(deployer.address)).to.be.true;
    });

    it("Should revert if already in whitelist", async function () {
      await expect(
        whitelist.addAddressToWhitelist()
      ).to.be.revertedWithCustomError(whitelist, "AlreadyInWhitelist");
    });

    it("Should revert if all whitelist slots reserved", async function () {
      const freeSlot = maxWhitelistedAddresses - numAddressesWhitelisted;
      let user;

      for (let i = 0; i < freeSlot; i++) {
        user = await getRandomUser();

        await whitelist.connect(user).addAddressToWhitelist();

        numAddressesWhitelisted += 1n;
      }

      expect(await whitelist.numAddressesWhitelisted()).to.eq(
        numAddressesWhitelisted
      );

      user = await getRandomUser();

      await expect(
        whitelist.connect(user).addAddressToWhitelist()
      ).to.be.revertedWithCustomError(
        whitelist,
        "MaxWhitelistedAddressesLimit"
      );
    });
  });

  const getRandomUser = async () => {
    let user = ethers.Wallet.createRandom();
    user = user.connect(ethers.provider);

    await deployer.sendTransaction({
      to: user.address,
      value: ethers.parseEther("0.1"),
    });

    return user;
  };
});
