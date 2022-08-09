describe("BookingFactory", function () {
  it("Should deploy", async function () {
    const BookingFactory = await ethers.getContractFactory("BookingFactory");
    const bookingFactory = await BookingFactory.deploy();
    await bookingFactory.deployed();
    const bookingFactoryAddress = bookingFactory.address;
    console.log("bookingFactoryAddress", bookingFactoryAddress);
  });

  it("It should: 1) create a booking, 2) deploy the lottery, 3) pay models/check in", async function () {
    // get wallets
    const [owner, client, modelOne, modelTwo, addedModel] =
      await ethers.getSigners();

    // deploy BookingFactory contract
    const BookingFactory = await ethers.getContractFactory("BookingFactory");
    const bookingFactory = await BookingFactory.deploy();
    await bookingFactory.deployed();
    const bookingFactoryAddress = bookingFactory.address;

    // deploy lottery contract
    const Lottery = await ethers.getContractFactory("Lottery");
    const lottery = await Lottery.deploy(bookingFactoryAddress);
    await lottery.deployed();
    const lotteryAddress = lottery.address;

    const valueOne = ethers.utils.parseEther("0.25");
    const valueTwo = ethers.utils.parseEther("0.25");

    console.log("value One", valueOne)
    await bookingFactory
      .connect(client)
      .createBooking(
        [modelOne.getAddress(), modelTwo.getAddress()],
        [valueOne, valueTwo],
        1649011885,
        {
          value: ethers.utils.parseEther("0.5"),
        }
      );

    const bookingID = await bookingFactory.bookingId();

    // await bookingFactory
    //   .connect(client)
    //   .payModel(modelOne.getAddress(), lotteryAddress, bookingID, {
    //     value: ethers.utils.parseEther("1.25"),
    //   });
    // await bookingFactory
    //   .connect(client)
    //   .payModel(modelTwo.getAddress(), lotteryAddress, bookingID, {
    //     value: ethers.utils.parseEther("1.25"),
    //   });

    //   models checks in without payment
    // await bookingFactory
    //   .connect(client)
    //   .modelCheckIn(modelOne.getAddress(), lotteryAddress, bookingID);
    // await bookingFactory
    //   .connect(client)
    //   .modelCheckIn(modelTwo.getAddress(), lotteryAddress, bookingID);

    // add a model to a active booking

    // const depoist = ethers.utils.parseEther("0.25");

    // await bookingFactory
    //   .connect(client)
    //   .addModel(bookingID, addedModel.getAddress(), depoist, {
    //     value: ethers.utils.parseEther("0.25"),
    //   });
    


    // ---------------  //
    // ----------------------------- pay model after booking completed -------------------------  //



    // await bookingFactory
    //   .connect(client)
    //   .payModel(addedModel.getAddress(), lotteryAddress, bookingID, {
    //     value: ethers.utils.parseEther("1.25"),
    //   });



    // model cancels 
    // const cancels = await bookingFactory.connect(modelOne).modelCancels(bookingID);





 // client cancels booking
    // await bookingFactory.connect(client).cancelBooking(bookingID, [modelOne.getAddress(), modelTwo.getAddress()] );


    // report as no show 
    // await bookingFactory.connect(client).reportAsNoShow(bookingID, modelTwo.getAddress());


    // check bookings for no shows
    // const noShow = await bookingFactory.noShows(bookingID);

    // console.log("no show address",noShow);
     

     // approve refund
    //  await bookingFactory.approveRefundForNoShow(bookingID, noShow );


     // checkForDeposists
    // const modelFound = await bookingFactory.checkForDeposists(bookingID);

    // const depositFound = await bookingFactory.checkForDeposists(bookingID);

     

      // pay owner if deposists found
      // await bookingFactory.payOwner(bookingID, depositFound.deposit, modelFound.model);



    const lotteryBalance = await lottery.getBalance();
    const lotteryPlayers = await lottery.getPlayers();
    const balanceOfBookingFactory = await bookingFactory.getBalance();

    // console.log("lotteryPlayers",lotteryPlayers);

    console.log("lotteryBalance", ethers.utils.formatEther(lotteryBalance));
    console.log(
      "balanceOfBookingFactory",
      ethers.utils.formatEther(balanceOfBookingFactory)
    );

    const ownerBalance = await owner.getBalance();
    const clientBalance = await client.getBalance();
    const modelOneBalance = await modelOne.getBalance();
    const modelTwoBalance = await modelTwo.getBalance();
    const addedModelBalance = await addedModel.getBalance();

    console.log("balance of owner", ethers.utils.formatEther(ownerBalance));
    console.log("balance of client", ethers.utils.formatEther(clientBalance));
    console.log(
      "balance of modelOne",
      ethers.utils.formatEther(modelOneBalance)
    );
    console.log(
      "balance of modelTwo",
      ethers.utils.formatEther(modelTwoBalance)
    );
    console.log(
      "balance of added Model",
      ethers.utils.formatEther(addedModelBalance)
    );
  });
});
