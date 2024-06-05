import { ethers, upgrades } from "hardhat";

async function main() {
  console.log("Starting deployment...");

  const MyTokenV1 = await ethers.getContractFactory("MyTokenV1");
  console.log("Contract factory for V1 obtained.");

  const myTokenV1 = await upgrades.deployProxy(
    MyTokenV1,
    ["0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"],
    {
      kind: "uups",
      unsafeAllow: ["constructor"],
    }
  );
  console.log("Deploying Proxy for UUPS Proxy Pattern V1...");
  await myTokenV1.waitForDeployment();
  console.log("UUPS Proxy Pattern MyTokenV1 deployed.");

  const myTokenV1Address = await myTokenV1.getAddress();
  console.log(
    `UUPS Proxy Pattern V1 is deployed to proxy address: ${myTokenV1Address}`
  );

  const MyTokenV2 = await ethers.getContractFactory("MyTokenV2");
  console.log("Contract factory for V2 obtained.");

  const upgraded = await upgrades.upgradeProxy(myTokenV1Address, MyTokenV2, {
    kind: "uups",
    unsafeAllow: ["constructor"],
    call: {
      fn: "initializeV2",
      args: ["0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"],
    },
  });
  console.log("Upgrading Proxy to UUPS Proxy Pattern V2...");
  await upgraded.waitForDeployment();
  console.log("UUPS Proxy Pattern MyTokenV2 deployed.");

  const upgradedAddress = await upgraded.getAddress();
  console.log(
    `UUPS Proxy Pattern V2 is upgraded in proxy address: ${upgradedAddress}`
  );
}

main().catch((error) => {
  console.error("Error in script execution:", error);
  process.exitCode = 1;
});
