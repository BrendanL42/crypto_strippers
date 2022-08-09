import { useEffect, useState, useContext } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import Image from "next/image";
import styles from "../styles/pay.module.css";
import { Button } from "@mui/material";
import { ethers } from "ethers";
import { lotteryAddress, bookingFactoryAddress } from "../config";
import BookingFactory from "../artifacts/contracts/BookingFactory.sol/BookingFactory.json";
import Web3Modal from "web3modal";
import AppContext from "../lib/AppContext";

export const getServerSideProps = async function (context) {
  const photo = context.query.photo;
  const index = context.query.index;
  const wallet = context.query.wallet;
  const bookId = context.query.bookId;
  const name = context.query.name;
  const fee = context.query.fee;
  const currency = context.query.currency;

  return {
    props: { photo, index, wallet, bookId, name, fee, currency },
  };
};

const pay = (props) => {
  const router = useRouter();
  const { throwMessage, user } = useContext(AppContext);
  const [convertedRate, setConvertedRate] = useState(0);
  const [once, setOnce] = useState(0);
  const [outstanding, setOutstanding] = useState(true);
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    if (props.currency === "AUD") {
      conversion("USD", props.fee);
    } else if (props.currency === "USD") {
      conversion("USD", props.fee);
    } else if (props.currency === "GBP") {
      conversion("GBP", props.fee);
    } else if (props.currency === "EUR") {
      conversion("EUR", props.fee);
    }
  }, []);

  useEffect(() => {
    axios
      .get(
        `${process.env.NEXT_PUBLIC_REACT_APP_SERVER_URL}/client/read/bookings`
      )
      .then((res) => {
        setBookings(res.data.bookings);
      })
      .catch((error) => {
        throwMessage("error", "Something went wrong", 3000);
      });
  }, []);

  const conversion = async (value, price) => {
    axios
      .get(
        `https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=${value}`
      )
      .then((res) => {
        if (value === "AUD") {
          setConvertedRate((1 / res.data.AUD) * price);
        } else if (value === "USD") {
          setConvertedRate((1 / res.data.USD) * price);
        } else if (value === "GBP") {
          setConvertedRate((1 / res.data.GBP) * price);
        } else if (value === "EUR") {
          setConvertedRate((1 / res.data.EUR) * price);
        }
      })
      .catch((error) => throwMessage("error", "Could not fetch rate"));
  };

  const myLoader = ({ src, width, quality }) => {
    return `${src}?w=${width}`;
  };

  const checkStatusOfModel = () => {
    const booking = bookings.find(
      (booking) => booking.bookingID === parseInt(props.bookId)
    );
    const paidStatus = booking.paid.find((wallet) => wallet === props.wallet);

    if (paidStatus) {
      return false;
    } else {
      return true;
    }
  };

  const updatePaid = () => {
    axios
      .put(`${process.env.NEXT_PUBLIC_REACT_APP_SERVER_URL}/bookings/paid`, {
        room: props.bookId,
        model: props.wallet,
        client: user._id,
      })
      .then((res) => {
        throwMessage("success", "Successfully paid");
        setOutstanding(false);
        setTimeout(() => {
          router.push("/bookings");
        }, 3000);
      })
      .catch((error) => {
        throwMessage("error", "Something went wrong", 3000);
      });
  };

  const payMode = async () => {
    if (checkStatusOfModel()) {
      const wei = ethers.utils.formatUnits(
        ethers.utils.parseEther(convertedRate.toString()),
        "wei"
      );
      try {
        const web3Modal = new Web3Modal();
        const connection = await web3Modal.connect();
        const provider = new ethers.providers.Web3Provider(connection);
        const signer = provider.getSigner();
        const BookingFactoryContract = new ethers.Contract(
          bookingFactoryAddress,
          BookingFactory.abi,
          signer
        );

        const payModel = await BookingFactoryContract.payModel(
          props.wallet,
          lotteryAddress,
          props.index,
          props.bookId,
          {
            value: wei,
          }
        );
        const tx = await payModel.wait();
        if (tx.confirmations === 1) {
          updatePaid();
          console.log(tx);
        } else {
          setOnce(false);
          throwMessage("error", "Something went wrong - tx");
        }
      } catch (err) {
        setOnce(false);
        console.log(err);
        if (
          err.data?.message ===
          "Error: VM Exception while processing transaction: reverted with reason string 'Only client can call'"
        ) {
          throwMessage(
            "error",
            "Please check the wallet your trying to pay from is the same as you created the booking with"
          );
        } else if (
          err.data?.message ===
          "Error: VM Exception while processing transaction: reverted with reason string 'Model Address does not match'"
        ) {
          throwMessage("error", "Incorrect models address");
        } else if (
          err.data?.message ===
          "Error: VM Exception while processing transaction: reverted with reason string 'Must be satus initiated'"
        ) {
          throwMessage("error", "Cannot pay model due to status of booking");
        } else {
          throwMessage("error", err.message);
        }
      }
    } else {
      throwMessage("error", "Model has already been paid");
    }
  };

  const btnPay = {
    color: "#24a19c !important",
    border: "1px solid #24a19c !important",
    marginRight: "20px",
    borderRadius: "10px",
    "&:hover": {
      color: "rgb(237, 108, 2) !important",
      border: "1px solid rgb(237, 108, 2) !important",
    },
  };
  return (
    <div className={styles.wrapper}>
      <div className={styles.imageWrapper}>
        <div className={styles.payments}>
          <span>Outstanding</span>
          <br />
          {outstanding ? (
            <span>
              {props.fee} {props.currency} / {convertedRate.toFixed(4)} ETHER
            </span>
          ) : (
            <span>0</span>
          )}
          <br />
        </div>

        <Image
          objectFit="cover"
          width={300}
          height={300}
          alt="Model"
          src={props.photo}
          loader={myLoader}
        />
        <h1>{props.name}</h1>
        <Button onClick={payMode} sx={btnPay} variant="outlined">
          Complete Payment
        </Button>
      </div>
    </div>
  );
};

export default pay;
