const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Storage Test", function () {
  let deployer;
  let contract;

  const SET_VALUE_SIG = "0x55241077";
  const GET_VALUE_SIG = "0x20965255";

  const INVALID_SIG = "0x0f52d65e";

  const setTo = 10n;

  before(async function () {
    [deployer] = await ethers.getSigners();

    contract = await ethers.deployContract("Storage");
    await contract.waitForDeployment();

    const factory = await ethers.getContractFactory("StorageS");
    const c = await factory.deploy();

    const p = await c.setValue(setTo);
    const r = await p.wait();
    console.log("StorageS:", r.gasUsed);
  });

  it("Should set value", async function () {
    const p = await contract.setValue(setTo);
    const r = await p.wait();
    console.log("Storage:", r.gasUsed);

    const data = ethers.solidityPacked(
      ["bytes4", "uint256"],
      [SET_VALUE_SIG, setTo]
    );

    await deployer.sendTransaction({
      to: contract.target,
      data: data,
    });
  });

  it("Should get value", async function () {
    const data = ethers.solidityPacked(["bytes4"], [GET_VALUE_SIG]);

    const result = await deployer.provider.call({
      to: contract.target,
      data: data,
    });

    expect(BigInt(result)).to.eq(setTo);
  });

  it("Should revert with invalid data", async function () {
    const data = ethers.solidityPacked(["bytes4"], [INVALID_SIG]);

    await expect(
      deployer.provider.call({
        to: contract.target,
        data: data,
      })
    ).to.be.reverted;
  });
});
