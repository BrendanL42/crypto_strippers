// describe("BookingFactory", function () {
//   it("Should deploy", async function () {
//     const BookingFactory = await ethers.getContractAt("BookingFactory");
//     const bookingFactory = await BookingFactory.deploy();
//     await bookingFactory.deployed();
//     const bookingFactoryAddress = bookingFactory.address;
//     console.log("bookingFactoryAddress", bookingFactoryAddress);
//   });

//   it("Should create new booking and pay model", async function () {
//     const [owner, client, modelOne, modelTwo] = await ethers.getSigners();
//     const BookingFactory = await ethers.getContractFactory("BookingFactory");
//     const bookingFactory = await BookingFactory.deploy();
//     await bookingFactory.deployed();

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
//     await bookingFactory.connect(client).payModel(modelOne.getAddress(), 0, 1, {
//       value: ethers.utils.parseEther("1"),
//     });
//     await bookingFactory.connect(client).payModel(modelTwo.getAddress(), 1, 1, {
//       value: ethers.utils.parseEther("1"),
//     });

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
//   });

//   it("It should cancel a booking", async function () {
//     const [owner, client, modelOne, modelTwo] = await ethers.getSigners();
//     const BookingFactory = await ethers.getContractFactory("BookingFactory");
//     const bookingFactory = await BookingFactory.deploy();
//     await bookingFactory.deployed();

//     const valueOne = ethers.utils.parseEther("1");
//     const valueTwo = ethers.utils.parseEther("1");

//     await bookingFactory
//       .connect(client)
//       .createBooking(
//         [modelOne.getAddress(), modelTwo.getAddress()],
//         [valueOne, valueTwo],
//         1647406800,
//         {
//           value: ethers.utils.parseEther("3"),
//         }
//       );

//     // await bookingFactory.connect(client).payModel(modelOne.getAddress(), 0, 1, {
//     //   value: ethers.utils.parseEther("1"),
//     // });
//     // await bookingFactory.payModel(modelTwo.getAddress(), 1, 1, {
//     //   value: ethers.utils.parseEther("1"),
//     // });

//     await bookingFactory.connect(client).cancelBooking(1);

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
//   });

//   it("It should refund the client", async function () {
//     const [owner, client, modelOne, modelTwo] = await ethers.getSigners();
//     const BookingFactory = await ethers.getContractFactory("BookingFactory");
//     const bookingFactory = await BookingFactory.deploy();
//     await bookingFactory.deployed();

//     const valueOne = ethers.utils.parseEther("1");
//     const valueTwo = ethers.utils.parseEther("1");

//     await bookingFactory
//       .connect(client)
//       .createBooking(
//         [modelOne.getAddress(), modelTwo.getAddress()],
//         [valueOne, valueTwo],
//         1647722820,
//         {
//           value: ethers.utils.parseEther("3"),
//         }
//       );
      
//     const beforeClientBalance = await client.getBalance();

//     console.log("balance of client before refund", ethers.utils.formatEther(beforeClientBalance));
 

//     await bookingFactory.connect(client).refundClient(1);

//     const clientBalance = await client.getBalance();
  
//     console.log("balance of client after refund", ethers.utils.formatEther(clientBalance));
 
//   });

//   it("It should cancel a model", async function () {
//     const [owner, client, modelOne, modelTwo] = await ethers.getSigners();
//     const BookingFactory = await ethers.getContractFactory("BookingFactory");
//     const bookingFactory = await BookingFactory.deploy();
//     await bookingFactory.deployed();

//     const valueOne = ethers.utils.parseEther("1");
//     const valueTwo = ethers.utils.parseEther("1");

//     await bookingFactory
//       .connect(client)
//       .createBooking(
//         [modelOne.getAddress(), modelTwo.getAddress()],
//         [valueOne, valueTwo],
//         1647406800,
//         {
//           value: ethers.utils.parseEther("3"),
//         }
//       );

//     // await bookingFactory.connect(client).payModel(modelOne.getAddress(), 0, 1, {
//     //   value: ethers.utils.parseEther("1"),
//     // });
//     await bookingFactory.connect(client).payModel(modelTwo.getAddress(), 1, 1, {
//       value: ethers.utils.parseEther("1"),
//     });

//     await bookingFactory.connect(modelOne).modelCancels(1, 0);

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
//   });


//   it("Report Model as no show", async function () {
//     const [owner, client, modelOne, modelTwo] = await ethers.getSigners();
//     const BookingFactory = await ethers.getContractFactory("BookingFactory");
//     const bookingFactory = await BookingFactory.deploy();
//     await bookingFactory.deployed();

//     const valueOne = ethers.utils.parseEther("1");
//     const valueTwo = ethers.utils.parseEther("1");

//     await bookingFactory
//       .connect(client)
//       .createBooking(
//         [modelOne.getAddress(), modelTwo.getAddress()],
//         [valueOne, valueTwo],
//         1644685200
// ,
//         {
//           value: ethers.utils.parseEther("3"),
//         }
//       );

//     await bookingFactory.connect(client).payModel(modelOne.getAddress(), 0, 1, {
//       value: ethers.utils.parseEther("1"),
//     });
   


//    await bookingFactory.connect(client).noShow(1);

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
//   });


// });
