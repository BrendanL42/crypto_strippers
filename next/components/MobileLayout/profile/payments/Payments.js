import { React, useContext, useEffect, forwardRef } from "react";
import useState from "react-usestateref";
import styles from "../../../../styles/Payments.module.css";
import bl from "../bl";
import AppContext from "../../../../lib/AppContext";

import axios from "axios";
import Web3Modal from "web3modal";
import { ethers } from "ethers";
import moment from "moment";

import { Box, Tooltip, Button } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

import { payModelAddress } from "../../../../config";
import PayModel from "../../../../artifacts/contracts/PayModel.sol/PayModel.json";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";

const wrapper = {
  position: "relative",
  backgroundImage:
    "radial-gradient(circle, #240534, #240224, #200017, #16000a, #000000);",
  padding: "2em",
  width: "100vw",
  minHeight: "100vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexDirection: "column",

  "@media (orientation: landscape) and (max-width: 800px)": {
    paddingTop: `15em`,
  },
  "@media (orientation: landscape) and (min-width: 801px)": {
    paddingTop: `0em`,
  },
};

const Payments = forwardRef((props, ref) => {
  const { throwMessage, signer, auth } = useContext(AppContext);
  const { model } = bl();

  const [eth, setEth] = useState([]);
  const [matic, setMatic] = useState([]);
  const [rate, setRate, rateRef] = useState("");

  const [customBtns, setCustomBtns] = useState([]);
  const [lapCost, setLapCost] = useState("");
  const [fiat, setFiat] = useState("");
  const [wallet, setWallet] = useState("");

  useEffect(() => {
    if (model._id) {
      axios
        .get(
          `${process.env.NEXT_PUBLIC_REACT_APP_SERVER_URL}/model/read/${model._id}/specialties `
        )
        .then(async (res) => {
          setCustomBtns(res.data.customBtns);
          setLapCost(res.data.lapCost);
          setFiat(res.data.fiat);
          setWallet(res.data.wallet);
        })
        .catch((error) => {
          throwMessage("error", "Something went wrong");
        });
    }
  }, [model]);

  useEffect(() => {
    axios
      .get("https://api.coingecko.com/api/v3/coins/matic-network/tickers")
      .then((res) => {
        setMatic(res.data);
      })
      .catch((error) => throwMessage("error", "Could not fetch rate", 3000));
    axios
      .get("https://api.coingecko.com/api/v3/coins/ethereum/tickers")
      .then((res) => {
        setEth(res.data);
      })
      .catch((error) => throwMessage("error", "Could not fetch rate", 3000));
  }, []);

  const conversion = async (value) => {
    axios
      .get(
        `https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=${value}`
      )
      .then((res) => {
        setRate(res.data);
      })
      .catch((error) => throwMessage("error", "Could not fetch rate", 3000));
  };
  const transfer = async (modelWallet, _payment) => {
  if(localStorage.getItem("wallet")){
    if (modelWallet && _payment) {
      const PayModelContract = new ethers.Contract(
        payModelAddress,
        PayModel.abi,
        signer
      );
      const payment = ethers.utils.parseUnits(
        _payment.toFixed(18).toString(),
        "ether"
      );
      let transaction = await PayModelContract.Transfer(modelWallet, {
        value: payment,
      });
      try {
        let tx = await transaction.wait();
        if (tx.confirmations === 1) {
          throwMessage("success", "Payment submitted successfully");
        }
      } catch {
        throwMessage("error", "An error occurred");
      }
    } else {
      throwMessage(
        "error",
        !modelWallet
          ? "No receiver address detected: Try Again"
          : !_payment
          ? "Amount not detected: Try Again"
          : null,
        3000
      );
    }
  } else {
    throwMessage("error", "Please connect a wallet");
  }
  };
  const calEth = async (amount) => {
    if (auth) {
      const currency = fiat.toString();
      const price = amount;
      if (currency === "AUD") {
        await conversion("AUD");
        const converted = (1 / rateRef.current.AUD) * price;
        setTimeout(() => {
          converted && transfer(wallet, converted);
        }, 1000);
      } else if (currency === "USD") {
        await conversion("USD");
        const converted = (1 / rateRef.current.USD) * price;
        setTimeout(() => {
          converted && transfer(wallet, converted);
        }, 1000);
      } else if (currency === "GBP") {
        await conversion("GBP");
        const converted = (1 / rateRef.current.GBP) * price;
        setTimeout(() => {
          converted && transfer(wallet, converted);
        }, 1000);
      } else if (currency === "EUR") {
        await conversion("EUR");
        const converted = (1 / rateRef.current.EUR) * price;
        setTimeout(() => {
          converted && transfer(wallet, converted);
        }, 1000);
      }
    } else {
      throwMessage("warning", "Please log in");
    }
  };

  return (
    <>
      <Box sx={wrapper}>
        <div className={styles.close}>
          <CloseIcon
            sx={{
              cursor: "pointer",
            }}
            fontSize="large"
            onClick={props.close}
          />
        </div>
        <h1 className={styles.info}>A new way to pay</h1>
        <p className={styles.infoPara}>
          Simply have your crypto wallet connected & select which services you
          would like to pay for
        </p>

        <hr style={{ width: "100%", margin: "1em auto 2em auto" }} />
        <ul className={styles.priceList}>
          <li>
            1 Matic = US $
            {matic.tickers ? matic.tickers[0].last.toFixed(2) : null}
          </li>
          <li>
            1 Ether = US ${eth.tickers ? eth.tickers[0].last.toFixed(2) : null}
          </li>
        </ul>
        <p className={styles.updated}>
          As of{" "}
          {matic.tickers
            ? moment(matic.tickers[0].last_fetch_at).format("MMM Do YYYY HH:mm")
            : null}
        </p>

        <p
          style={{
            fontStyle: "italic",
            color: "rgb(237, 108, 2)",
            marginBottom: "2em",
            color: "#FFF",
          }}
        >
          Prices below show in{" "}
          <span
            style={{
              fontWeight: "800",

              color: "rgb(237, 108, 2)",
            }}
          >
            ({fiat})
          </span>
        </p>

        <div className={styles.container}>
          <div className={styles.btnContainer}>
            <button onClick={() => calEth(lapCost)}>Lap Dance</button>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                width: "90%",
                margin: "0 auto",
              }}
            >
              <Tooltip
                disableFocusListener
                title="A sensual lap dance"
                placement="bottom"
              >
                <HelpOutlineIcon style={{ cursor: "pointer" }} />
              </Tooltip>

              <Tooltip
                disableFocusListener
                title="Price in fiat"
                placement="bottom"
              >
                <span className={styles.price}>{lapCost}</span>
              </Tooltip>
            </div>
          </div>

          {customBtns?.map((btn, index) => (
            <div className={styles.btnContainer} key={index}>
              <button onClick={() => calEth(btn.price)}>{btn.title}</button>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  width: "90%",
                  margin: "0 auto",
                }}
              >
                <Tooltip
                  disableFocusListener
                  title={btn.description}
                  placement="bottom"
                >
                  <HelpOutlineIcon style={{ cursor: "pointer" }} />
                </Tooltip>
                <Tooltip
                  disableFocusListener
                  title="Price in fiat"
                  placement="bottom"
                >
                  <span className={styles.price}>{btn.price}</span>
                </Tooltip>
              </div>
            </div>
          ))}
        </div>
      </Box>
    </>
  );
});

export default Payments;
