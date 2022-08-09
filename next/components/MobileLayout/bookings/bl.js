import { useEffect, useContext } from "react";
import axios from "axios";
import useState from "react-usestateref";
import { useRouter } from "next/router";
import AppContext from "../../../lib/AppContext";
import useConversion from "../useConversion";

import { bookingFactoryAddress, lotteryAddress } from "../../../config";
import BookingFactory from "../../../artifacts/contracts/BookingFactory.sol/BookingFactory.json";
import { ethers } from "ethers";

import { findIndex } from "lodash";

const bl = () => {
  const { user, setTriggerReAuth, loadingModelClose, throwMessage, signer } =
    useContext(AppContext);

  const router = useRouter();
  const [anchorEl, setAnchorEl] = useState(null);
  const [finalConfirm, setFinalConfirm, finalConfirmRef] = useState(false);
  const [qrCode, setQrCode] = useState(false);
  const [reported, setReported] = useState("");
  const [cancelBookingState, setCancelBookingState] = useState(false);
  const [removeModelState, setRemoveModelState] = useState(false);
  const [message, setMessage] = useState("");
  const [fee, setFee] = useState(0);

  const [model, setModel] = useState("");
  const [room, setRoom] = useState("");
  const [bookingID, setBookingID] = useState(0);
  const [index, setIndex] = useState();
  const [client, setClient] = useState("");
  const [openDia, setOpenDia] = useState(false);
  const [modelToAdd, setModelToAdd] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const open = Boolean(anchorEl);

  const [bookings, setBookings, bookingsRef] = useState([]);
  const [once, setOnce] = useState(false);

  // blockchain functions
  const [lcBookingContract, setLcBookingContract] = useState();
  const [convertedRate, setConvertedRate] = useState(0);
  const [conversion, setConversion] = useState("");
  const [models, setModels] = useState([]);
  const [startDates, setStartDates] = useState();
  const [roomID, setRoomID] = useState("");
  const [deposits, setDeposits] = useState([]);
  const [depositsConverted, setDepositsConverted, depositsConvertedRef] =
    useState([]);

  const { rate } = useConversion(conversion);

  // ----------------------------------------------------------------------------  //
  // ----------------------------- BLOCKCHAIN LOGIC START -----------------------  //
  // ----------------------------------------------------------------------------  //

  // create local copy of contract
  useEffect(async () => {
    const BookingFactoryContract = new ethers.Contract(
      bookingFactoryAddress,
      BookingFactory.abi,
      signer
    );

    setLcBookingContract(BookingFactoryContract);
  }, [signer]);

  // ----------------------------- CREATE NEW BOOKING -----------------------  //

  // convert converted rate into wei
  useEffect(async () => {
    if (rate) {
      let converted = [];
      let convertedIndividual = [];
      let sum = 0;

      deposits.map((item) => {
        converted.push((1 / rate) * item);
        // convert individual deposits into wei
        const eth = (1 / rate) * item;
        const percent = (20 / 100) * eth;
        const stringIndiv = percent.toString();
        const weiIndiv = ethers.utils.parseEther(stringIndiv);
        convertedIndividual.push(weiIndiv);
      });

      setDepositsConverted(convertedIndividual);

      // add all deposit and convert to wei
      sum = converted.reduce(function (a, b) {
        return a + b;
      }, 0);
      const calDeposit = (20 / 100) * sum;
      const string = calDeposit.toString();
      const wei = ethers.utils.parseEther(string);
      setConvertedRate(wei);
    }
  }, [rate]);

  // call booking contract & create new booking
  useEffect(async () => {
    setConversion();
    if (convertedRate !== 0) {
      try {
        const BookingFactoryContract = new ethers.Contract(
          bookingFactoryAddress,
          BookingFactory.abi,
          signer
        );
        const newBooking = await BookingFactoryContract.createBooking(
          models,
          depositsConvertedRef.current,
          startDates,
          {
            value: convertedRate,
          }
        );
        const tx = await newBooking.wait();

        if (tx.confirmations === 1) {
          console.log(tx);
          confirmBooking(roomID, tx.events[0].args.bookingId.toNumber());
        } else {
          throwMessage("error", "Something went wrong - tx");
        }
      } catch (err) {
        throwMessage("error", "Something went wrong - catch");
        console.log(err);
      }
    }
  }, [convertedRate]);

  // convert deposit into wei and attach to value of transaction
  const convertFee = async (booking) => {
    if (
      localStorage.getItem("wallet") &&
      signer &&
      booking.accepted.length > 0
    ) {
      setModels(booking.accepted.map((bookings) => bookings.wallet));
      setStartDates(Date.parse(booking.start));
      setRoomID(booking.roomId);
      const feeFiat = booking.accepted.map((bookings) => bookings.feeFiat.fee);
      const feeCurrency = booking.currency;
      const convertNum = feeFiat.map(Number);
      setDeposits(convertNum);
      if (feeCurrency === "AUD") {
        setConversion("AUD");
      } else if (feeCurrency === "USD") {
        setConversion("USD");
      } else if (feeCurrency === "GBP") {
        setConversion("GBP");
      } else if (feeCurrency === "EUR") {
        setConversion("EUR");
      }
    } else {
      throwMessage("error", "Please connect a wallet");
    }
  };

  // ----------------------------- MODEL CANCELS -----------------------  //

  // remove model from all bookings and update chat
  const declineBooking = async () => {
    if (index !== -1) {
      modelCancel(bookingID, index);
    } else {
      apiCallModelCancel();
    }
  };

  const modelCancel = async (bookingID, index) => {
    try {
      const cancelModel = await lcBookingContract.modelCancels(bookingID);
      const tx = await cancelModel.wait();
      if (tx.confirmations === 1) {
        apiCallModelCancel();
        throwMessage(
          "success",
          "Successfully removed yourself from the booking"
        );
      }
    } catch (err) {
      if (
        err.data.message ===
        "Error: VM Exception while processing transaction: reverted with reason string 'Must be satus initiated'"
      ) {
        apiCallModelCancel();
      } else if (
        err.data.message ===
        "Error: VM Exception while processing transaction: reverted with reason string 'Only Model can cancel own request'"
      ) {
        throwMessage("error", "Incorrect wallet");
      } else if (
        err.data.message ===
        "Error: VM Exception while processing transaction: reverted with reason string 'Model already paid'"
      ) {
        throwMessage("error", "Already paid or checked in");
      }
    }
  };

  const apiCallModelCancel = () => {
    axios
      .put(`${process.env.NEXT_PUBLIC_REACT_APP_SERVER_URL}/bookings/decline`, {
        _id: model,
        room: room,
        client: client,
        message: message,
      })
      .then((res) => {
        getBookings();
        handleCloseDia();
        setTimeout(() => {
          setOnce(false);
        }, 1000);
      })
      .catch((error) => {
        throwMessage("error", "Something went wrong", 3000);
        setTimeout(() => {
          setOnce(false);
        }, 1000);
      });
  };

  // ----------------------------- Client CANCELS -----------------------  //

  // check what state the booking is in
  const cancelBookingCheck = () => {
    if (!once) {
      setOnce(true);
      const booking = bookings.filter((booking) => booking.roomId === room);
      const wallets = booking[0].accepted.map((model) => model.wallet);

      if (booking[0].accepted.length !== 0 && booking[0].bookingID) {
        // client cancels with girls in booking and depost paid
        cancelBooking(booking[0].bookingID, wallets);
      } else if (
        booking[0].accepted.length !== 0 &&
        booking[0].bookingID === undefined
      ) {
        // client cancels with accepted girls in booking and depost not paid
        apiCallClientCancels();
      } else if (
        booking[0].bookedGirls.length !== 0 &&
        booking[0].bookingID === undefined
      ) {
        // client cancels with no accepted girls in booking and depost not paid but with girls in booking
        apiCallClientCancels();
      } else if (
        booking[0].bookedGirls.length === 0 &&
        booking[0].bookingID === undefined
      ) {
        // client cancels with no girls in booking and depost not paid
        apiCallClientCancelsEmpty();
      }
    }
  };

  // call smart contract to cancel booking
  const cancelBooking = async (bookingId, wallets) => {
    try {
      const cancelBooking = await lcBookingContract.cancelBooking(
        bookingId,
        wallets
      );
      const tx = await cancelBooking.wait();

      if (tx.confirmations === 1) {
        apiCallClientCancels();
        throwMessage("success", "Successfully cancelled booking");
      }
    } catch (err) {
      console.log(err);
      if (
        err.data.message ===
        "Error: VM Exception while processing transaction: reverted with reason string 'Must be satus initiated'"
      ) {
        throwMessage("error", "Booking can't be in progress");
      }
      if (
        err.data.message ===
        "Error: VM Exception while processing transaction: reverted with reason string 'Only client can call'"
      ) {
        throwMessage(
          "error",
          "Only the wallet who created this booking can cancel it"
        );
      } else {
        throwMessage("error", err.data.message);
      }
    }
  };

  // call api to update database if no girls in booking
  const apiCallClientCancelsEmpty = () => {
    axios
      .put(`${process.env.NEXT_PUBLIC_REACT_APP_SERVER_URL}/bookings/retract`, {
        room: room,
        client: client,
      })
      .then((res) => {
        getBookings();
        handleCloseDia();
        setTimeout(() => {
          setOnce(false);
        }, 1000);
      })
      .catch((error) => {
        setOnce(false);
        throwMessage("error", "Something went wrong", 3000);
      });
  };

  const apiCallClientCancels = () => {
    axios
      .put(`${process.env.NEXT_PUBLIC_REACT_APP_SERVER_URL}/bookings/cancel`, {
        room: room,
        client: client,
        message: message,
      })
      .then((res) => {
        getBookings();
        handleCloseDia();
        setTimeout(() => {
          setOnce(false);
        }, 1000);
      })
      .catch((error) => {
        setOnce(false);
        throwMessage("error", "Something went wrong", 3000);
      });
  };

  // ----------------------------- CLIENT ADDS MODEL TO ACTIVE BOOKING  -----------------------  //


  // once model accepts booking, confirm acceptances by sending in depost


  // ----------------------------------------------------------------------------  //
  // ----------------------------- BLOCKCHAIN LOGIC END -------------------------  //
  // ----------------------------------------------------------------------------  //

  // client adds a new model to the booking
  const addModelToBooking = (model, room, client) => {
    const currentBooking = bookings.find((booking) => booking.roomId === room);
    const modelExists = currentBooking.bookedGirls.find(
      (girl) => girl._id === model._id || girl._id === model._id
    );

    if (modelExists) {
      throwMessage("warning", "Model is already in the current booking", 2000);
    } else {
      if (!once) {
        setOnce(true);

        const _model = {
          fName: model.fName,
          lName: model.lName,
          _id: model._id,
          thumbnail: model.thumbnail,
        };

        axios

          .put(`${process.env.NEXT_PUBLIC_REACT_APP_SERVER_URL}/bookings/add`, {
            model: _model,
            room: room,
            client: client,
          })
          .then((res) => {
            setModelToAdd("");
            getBookings();
            setTimeout(() => {
              setOnce(false);
            }, 1000);
          })
          .catch((error) => {
            setOnce(false);
            throwMessage("error", "Something went wrong");
          });
      }
    }
  };

  const checkIfAllConfirmed = async () => {
    setTimeout(() => {
      const check = bookingsRef.current.find(
        (booking) => booking.roomId === room
      );
      const remaningModel = check.bookedGirls.map((model) => model._id);
      const confirmedModels = check.accepted.map((model) => model._id);

      const checkRemaining =
        remaningModel.length === confirmedModels.length &&
        remaningModel.every(function (element) {
          return confirmedModels.includes(element);
        });

      if (checkRemaining && remaningModel.length > 0) {
        setFinalConfirm(true);
      }
    }, 2000);
  };

  const getBookings = async () => {
    axios
      .get(
        `${process.env.NEXT_PUBLIC_REACT_APP_SERVER_URL}/${
          user.role === "model" ? "model" : "client"
        }/read/bookings`
      )
      .then((res) => {
        setBookings(res.data.bookings);
        loadingModelClose();
      })
      .catch((error) => {
        loadingModelClose();
        throwMessage("error", "Something went wrong", 3000);
      });
  };

  const handleClickOpenDia = (
    model,
    room,
    client,
    cancel,
    status,
    bookingID,
    index
  ) => {
    setMessage("");
    setCancelBookingState(false);
    setRemoveModelState(false);
    setModel(model);
    setRoom(room);
    setBookingID(bookingID);
    setIndex(
      findIndex(index, {
        _id: model,
      })
    );
    setClient(client);
    if (cancel === true) {
      setCancelBookingState(true);
      setOpenDia(true);
    } else if (cancel === "removeModel") {
      if (status === "confirmed") {
        throwMessage(
          "warning",
          "Cannot remove models once booking confirmed",
          2000
        );
      } else {
        setRemoveModelState(true);
        setOpenDia(true);
      }
    } else {
      setOpenDia(true);
    }
  };

  const handleCloseDia = () => {
    setOpenDia(false);
    setModel("");
    setRoom("");
    setClient("");
    setMessage("");
  };
  // push to chat page
  const handleChat = (roomId) => {
    const room = roomId;
    const userId = user.fName + "." + user.lName[0];
    router.push(
      `/${user.fName}-${user.lName}/messages/${room}?userId=${userId}`
    );
  };

  // report and send email
  const reportBooking = (booking) => {
    if (!once) {
      setOnce(true);
      axios
        .put(`${process.env.NEXT_PUBLIC_REACT_APP_SERVER_URL}/report/booking`, {
          booking: booking,
          user: user.fName + " " + user.lName,
        })
        .then((res) => {
          res.data.message && setReported(booking.roomId);
          setOnce(false);
        })
        .catch((error) => {
          setOnce(false);
          throwMessage("error", "Something went wrong", 3000);
        });
    }
  };

  // client removes model from booking
  const removeModel = (model, room, client) => {
    /// stop client removing model once she ahs co  const check = bookingsRef.current.find(

    const check = bookingsRef.current.find(
      (booking) => booking.roomId === room
    );
    const modelsStatus = check.accepted.find((models) => models._id === model);

    if (!once) {
      if (!modelsStatus) {
        setOnce(true);
        axios
          .put(
            `${process.env.NEXT_PUBLIC_REACT_APP_SERVER_URL}/bookings/remove`,
            {
              _id: model,
              room: room,
              client: client,
              message: message,
            }
          )
          .then(async (res) => {
            await getBookings();
            checkIfAllConfirmed();
            handleCloseDia();
            setTimeout(() => {
              setOnce(false);
            }, 1000);
          })
          .catch((error) => {
            setOnce(false);
            throwMessage("error", "Something went wrong", 3000);
          });
      } else {
        throwMessage("warning", "Other party has already confirmed");
      }
    }
  };

  const handleAccept = async (
    model,
    name,
    surname,
    room,
    client,
    fee,
    wallet,
    currency
  ) => {
    if (localStorage.getItem("wallet")) {
      if (currency === user.fiat) {
        setOnce(true);
        if (!once) {
          callApi(model, name, surname, room, client, wallet);
        }
      } else {
        throwMessage(
          "error",
          `Please change your currency ${user.fiat} to ${currency}`
        );
      }
    } else {
      throwMessage("error", "Please connect a wallet");
    }
  };

  const callApi = (model, name, surname, room, client, wallet) => {
    if (localStorage.getItem("wallet") && fee) {
      const _model = {
        _id: model,
        fName: name,
        lName: surname,
        room: room,
        client: client,
        feeFiat: { fee: fee, currency: user.fiat },
        wallet: wallet,
      };

      axios
        .put(
          `${process.env.NEXT_PUBLIC_REACT_APP_SERVER_URL}/bookings/accept`,
          _model
        )
        .then((res) => {
          getBookings();
          handleCloseDia();
          setTimeout(() => {
            setOnce(false);
          }, 1000);
        })
        .catch((error) => {
          setOnce(false);
          throwMessage("error", "Something went wrong");
        });
    } else {
      throwMessage("error", "Please connect your wallet");
    }
  };

  const confirmBooking = (roomId, bookingID) => {
    axios
      .put(`${process.env.NEXT_PUBLIC_REACT_APP_SERVER_URL}/bookings/confirm`, {
        room: roomId,
        bookingID: bookingID,
      })
      .then((res) => {
        router.reload();
      })
      .catch((error) => {
        throwMessage("error", "Something went wrong", 3000);
      });
  };

  useEffect(async () => {
    if (user._id) {
      getBookings();
    }
  }, [user]);

  // add model to current booking
  useEffect(async () => {
    let fName = "";
    let lName = "";
    let _id = "";

    if (router.query.add) {
      axios
        .get(
          `${process.env.NEXT_PUBLIC_REACT_APP_SERVER_URL}/model/read/${router.query.add}`
        )
        .then((res) => {
          (fName = res.data.fName),
            (lName = res.data.lName),
            (_id = res.data._id);

          axios
            .get(
              `${process.env.NEXT_PUBLIC_REACT_APP_SERVER_URL}/model/read/${router.query.add}/photos`
            )
            .then((res) => {
              const thumbnail = res.data.photos.filter(
                (item) => item.thumbnail === true
              )[0].url;

              const _model = {
                fName: fName,
                lName: lName,
                _id: _id,
                thumbnail: thumbnail,
              };
              setModelToAdd(_model);
            })
            .catch((error) => {
              throwMessage("error", "Something went wrong 1", 3000);
            });
        })
        .catch((error) => {
          throwMessage("error", "Something went wrong 1", 3000);
        });
    }
  }, [router.isReady]);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return {
    setFinalConfirm,
    getBookings,
    finalConfirmRef,
    model,
    room,
    client,
    handleAccept,
    addModelToBooking,
    modelToAdd,
    message,
    setMessage,
    openDia,
    handleCloseDia,
    handleClickOpenDia,
    signer,
    throwMessage,
    reported,
    setTriggerReAuth,
    user,
    reportBooking,
    declineBooking,
    handleChat,
    handleClose,
    handleClick,
    anchorEl,
    open,
    cancelBookingCheck,
    removeModel,
    cancelBookingState,
    removeModelState,
    bookings,
    fee,
    setFee,
    bookingsRef,
    confirmBooking,
    qrCode,
    setQrCode,
    thumbnail,
    convertFee,
  };
};

export default bl;
