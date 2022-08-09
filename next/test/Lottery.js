// describe("Lottery", function () {
//   it("Should deploy Lottery and BookingFactory then create a booking, pay two models then transfer to lottery and owner ", async function () {
//     const BookingFactory = await ethers.getContractFactory("BookingFactory");
//     const bookingFactory = await BookingFactory.deploy();
//     await bookingFactory.deployed();
//     const bookingFactoryAddress = bookingFactory.address;
//     console.log("bookingFactoryAddress", bookingFactoryAddress);

//     const Lottery = await ethers.getContractFactory("Lottery");
//     const lottery = await Lottery.deploy(bookingFactoryAddress);
//     await lottery.deployed();
//     const lotteryAddress = lottery.address;
//     console.log("Lottery deployed to", lotteryAddress);

//     const [owner, client, modelOne, modelTwo] = await ethers.getSigners();

//     const valueOne = ethers.utils.parseEther("1");
//     const valueTwo = ethers.utils.parseEther("1");

//     const newBooking = await bookingFactory
//       .connect(client)
//       .createBooking(
//         [modelOne.getAddress(), modelTwo.getAddress()],
//         [valueOne, valueTwo],
//         1644730137,
//         {
//           value: ethers.utils.parseEther("10"),
//         }
//       );
//     await bookingFactory
//       .connect(client)
//       .payModel(modelOne.getAddress(), lotteryAddress, 0, 1, {
//         value: ethers.utils.parseEther("1"),
//       });
//     await bookingFactory
//       .connect(client)
//       .payModel(modelTwo.getAddress(), lotteryAddress, 1, 1, {
//         value: ethers.utils.parseEther("1"),
//       });

//     const ownerBalance = await owner.getBalance();
//     const clientBalance = await client.getBalance();
//     const modelOneBalance = await modelOne.getBalance();
//     const modelTwoBalance = await modelTwo.getBalance();

//     console.log("balance of owner", ethers.utils.formatEther(ownerBalance));
//     console.log("balance of client", ethers.utils.formatEther(clientBalance));
//     console.log(
//       "balance of modelOne",
//       ethers.utils.formatEther(modelOneBalance)
//     );
//     console.log(
//       "balance of modelTwo",
//       ethers.utils.formatEther(modelTwoBalance)
//     );

//     const lotteryBalance = await lottery.getBalance();
//     const lotteryPlayers = await lottery.getPlayers();
//     console.log("lotteryBalance", ethers.utils.formatEther(lotteryBalance));
//     console.log("lotteryBalance", lotteryPlayers);
//   });
// });
