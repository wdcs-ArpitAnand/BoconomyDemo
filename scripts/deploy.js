const { ethers } = require("hardhat");

const main = async() => {
  const [deployer] = await ethers.getSigners();

  const Greeter = await ethers.getContractFactory("Greeter");
  const greeter = await Greeter.deploy("HelloWorld!", deployer.address);

  console.log("Greeter address:", greeter.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });