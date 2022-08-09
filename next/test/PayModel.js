// describe("PayModel", function () {
//   it("Should transfer money to model", async function () {
//     const PayModel = await ethers.getContractFactory("PayModel");
//     const payModel = await PayModel.deploy();
//     await payModel.deployed();
//     const payModelAddress = payModel.address;

//     const [_, buyerAddress] = await ethers.getSigners();
//     console.log("payModelAddress", buyerAddress.address);
//     const price = ethers.utils.parseUnits("10", "ether");
//     await payModel.Transfer(buyerAddress.address, { value: price });
//   });
// });
