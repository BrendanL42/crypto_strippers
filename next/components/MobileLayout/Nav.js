import styles from "../../styles/Nav.module.css";
import blLottery from "./blLottery";
import { useContext } from "react";
import AppContext from "../../lib/AppContext";
import axios from "axios";

import MenuIcon from "@mui/icons-material/Menu";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CurrencyPoundIcon from "@mui/icons-material/CurrencyPound";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import EuroSymbolIcon from "@mui/icons-material/EuroSymbol";
import { Tooltip, Button } from "@mui/material";

const Nav = () => {
  const {
    navClient,
    navModel,
    setNavModel,
    setNavClient,
    auth,
    user,
    connectWalletHandler,
    signer,
  } = useContext(AppContext);

  const { potFiat, enterLottery, hours, percent, ratio, pickWinner } =
    blLottery();

  const lottery = {
    fontSize: "0.83em",
    textTransform: "capitalize",
  };
  return (
    <div className={styles.topNavFixed}>
      <IconButton
        style={{ color: "#FeFeFe" }}
        aria-label="back"
        component="button"
        onClick={() => {
          setNavModel(6);
          setNavClient(6);
        }}
      >
        {!auth && <ArrowBackIcon fontSize="large" />}

        {user && user.role === "model" && navModel !== 6 && auth && (
          <ArrowBackIcon fontSize="large" />
        )}
        {user && user.role === "client" && navClient !== 6 && auth && (
          <ArrowBackIcon fontSize="large" />
        )}
      </IconButton>

      {/* <Button onClick={pickWinner}>Pick Winner</Button> */}

      {signer && auth && potFiat !== "NaN" && (
        <Tooltip
          disableFocusListener
          title={`${percent} chance of winning or ${ratio} odds`}
          placement="bottom"
          style={{ cursor: "pointer" }}
        >
          <Button sx={lottery} onClick={enterLottery}>
            <span
              className={styles.countdown}
              style={{
                marginLeft: "0",
              }}
            >
              {user.fiat === "USD" ? (
                <AttachMoneyIcon
                  style={{
                    color: "rgb(39, 85, 170)",
                    marginRight: "1px",
                    marginBottom: "-4px",
                  }}
                />
              ) : user.fiat === "AUD" ? (
                <AttachMoneyIcon
                  style={{
                    color: "rgb(39, 85, 170)",
                    marginRight: "1px",
                    marginBottom: "-4px",
                  }}
                />
              ) : user.fiat === "GBP" ? (
                <CurrencyPoundIcon
                  fontSize="small"
                  style={{
                    color: "rgb(39, 85, 170)",
                    marginRight: "1px",
                    marginBottom: "-4px",
                  }}
                />
              ) : user.fiat === "EUR" ? (
                <EuroSymbolIcon
                  style={{
                    color: "rgb(39, 85, 170)",
                    marginRight: "1px",
                    marginBottom: "-4px",
                  }}
                />
              ) : null}
              {potFiat !== "NaN" ? `${potFiat}` : "Click To Enter"}
              {" - "}
              Drawn in {hours} hrs
            </span>
          </Button>
        </Tooltip>
      )}

      {!signer && auth && (
        <Button onClick={() => connectWalletHandler(true)}>
          Connect Wallet
        </Button>
      )}

      {user && user.role === "model" && navModel !== 5 && (
        <MenuIcon
          style={{ cursor: "pointer", marginRight: "8px" }}
          onClick={() => {
            setNavModel(5);
            setNavClient(5);
          }}
          fontSize="large"
        />
      )}
      {user && user.role === "client" && navClient !== 5 && (
        <MenuIcon
          style={{ cursor: "pointer", marginRight: "8px" }}
          onClick={() => {
            setNavModel(5);
            setNavClient(5);
          }}
          fontSize="large"
        />
      )}

      {auth && user && user.role === "client" && navClient === 5 && (
        <IconButton
          style={{ color: "#FFF" }}
          aria-label="menu"
          component="button"
          onClick={() => {
            setNavClient(6);
          }}
        >
          <CloseIcon fontSize="large" />
        </IconButton>
      )}

      {user && user.role === "model" && navModel === 5 && (
        <IconButton
          style={{ color: "#FFF" }}
          aria-label="menu"
          component="button"
          onClick={() => {
            setNavModel(6);
          }}
        >
          <CloseIcon fontSize="large" />
        </IconButton>
      )}
    </div>
  );
};

export default Nav;
