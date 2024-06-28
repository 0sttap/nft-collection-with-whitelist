const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Add Two Test", function () {
  let deployer;
  let contract;

  const ADD_TWO_SIG = "0x0f52d66e";
  const INVALID_SIG = "0x0f52d65e";

  const num1 = 4n;
  const num2 = 3n;

  before(async function () {
    [deployer] = await ethers.getSigners();

    contract = await ethers.deployContract("AddTwo");
    await contract.waitForDeployment();
  });

  it("Should add two numbers", async function () {
    const data = ethers.solidityPacked(
      ["bytes4", "uint8", "uint8"],
      [ADD_TWO_SIG, num1, num2]
    );

    const result = await deployer.provider.call({
      to: contract.target,
      data: data,
    });

    expect(BigInt(result)).to.eq(num1 + num2);
  });

  it("Should revert with invalid data", async function () {
    const data = ethers.solidityPacked(
      ["bytes4", "uint8", "uint8"],
      [INVALID_SIG, num1, num2]
    );

    await expect(
      deployer.provider.call({
        to: contract.target,
        data: data,
      })
    ).to.be.reverted;
  });
});
