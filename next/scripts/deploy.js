const hre = require("hardhat");

async function main() {
  const PayModel = await hre.ethers.getContractFactory("PayModel");
  const payModel = await PayModel.deploy();
  await payModel.deployed();
  console.log("payModel deployed to:", payModel.address);

  const Market = await hre.ethers.getContractFactory("Market");
  const market = await Market.deploy();
  await market.deployed();
  console.log("market deployed to:", market.address);

  const NFT = await hre.ethers.getContractFactory("NFT");
  const nft = await NFT.deploy(market.address);
  await nft.deployed();
  console.log("NFT deployed to:", nft.address);

  const BookingFactory = await hre.ethers.getContractFactory("BookingFactory");
  const bookingFactory = await BookingFactory.deploy();
  await bookingFactory.deployed();
  console.log("BookingFactory deployed to:", bookingFactory.address);

  const Lottery = await hre.ethers.getContractFactory("Lottery");
  const lottery = await Lottery.deploy(bookingFactory.address);
  await lottery.deployed();
  console.log("Lottery deployed to:", lottery.address);



}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
