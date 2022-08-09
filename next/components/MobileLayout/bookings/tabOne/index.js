import { React } from "react";
import bl from "./bl";
import styles from "../../../../styles/Bookings.module.css";

import Link from "next/link";
import moment from "moment";
import QRCode from "react-qr-code";
import { findIndex } from "lodash";
import PropTypes from "prop-types";

import {
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  SpeedDial,
  SpeedDialAction,
  AvatarGroup,
  Avatar,
  Menu,
  MenuItem,
  Box,
  InputAdornment,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Button,
} from "@mui/material";

import EmailIcon from "@mui/icons-material/Email";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
import ContactPhoneIcon from "@mui/icons-material/ContactPhone";
import SettingsIcon from "@mui/icons-material/Settings";
import ChatIcon from "@mui/icons-material/Chat";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import ReportIcon from "@mui/icons-material/Report";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const Bookings = () => {
  const {
    model,
    room,
    client,
    handleAccept,
    addModelToBooking,
    modelToAdd,
    cancelBookingState,
    message,
    removeModelState,
    setMessage,
    reported,
    user,
    reportBooking,
    declineBooking,
    handleChat,
    handleClose,
    handleClick,
    anchorEl,
    open,
    handleCloseDia,
    handleClickOpenDia,
    openDia,
    cancelBookingCheck,
    removeModel,
    bookingsRef,
    fee,
    setFee,
    convertFee,
  } = bl();

  const card = {
    boxShadow: 3,
    backgroundColor: "#F6F6F6",
    padding: "1.5em 1em 1em 1em",
    color: "grey",
  };

  const accordion = {
    backgroundColor: "#ffffff17 !important",
    boxShadow: 0,
  };

  const title = {
    margin: 0,
    padding: 0,
  };

  const viewDets = {
    fontWeight: "400",
    letterSpacing: "1px",
    textTransform: "capitalize",
    fontSize: "0.9em",
    color: "#D96098",
  };

  const details = {
    padding: "0",
    fontWeight: "300",
    letterSpacing: "1px",
    textTransform: "capitalize",
    lineHeight: "1.7",
    fontSize: "0.9em",
    color: "rgb(82, 82, 82)",
  };

  const avatars = (theme) => ({
    width: 100,
    height: 100,
    [theme.breakpoints.down("sm")]: {
      width: 70,
      height: 70,
    },
  });

  const avatarsadd = (theme) => ({
    border: "5px solid orange",
    width: 110,
    height: 110,
    [theme.breakpoints.down("sm")]: {
      width: 70,
      height: 70,
    },
  });

  function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`full-width-tabpanel-${index}`}
        aria-labelledby={`full-width-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box>
            <Typography>{children}</Typography>
          </Box>
        )}
      </div>
    );
  }

  TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
  };

  return (
    <>
      <div className={styles.wrapper} style={{ paddingTop: "55px" }}>
        <Dialog open={openDia} onClose={handleCloseDia}>
          {user.role === "model" ? (
            <DialogTitle>Cancel my booking invitation</DialogTitle>
          ) : (
            <DialogTitle>Cancel my booking</DialogTitle>
          )}
          <DialogContent>
            <DialogContentText>
              Please give a reason to why you need to cancel your booking.
            </DialogContentText>
            <TextField
              onChange={(e) => setMessage(e.target.value)}
              value={message}
              autoFocus
              margin="dense"
              label="Reason"
              type="text"
              fullWidth
              variant="standard"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDia}>Close</Button>
            {user.role === "model" && (
              <Button onClick={() => declineBooking()}>Yes cancel</Button>
            )}

            {user.role === "client" && cancelBookingState && (
              <Button onClick={cancelBookingCheck}>Yes cancel booking</Button>
            )}

            {user.role === "client" && removeModelState && (
              <Button onClick={() => removeModel(model, room, client)}>
                Remove Model
              </Button>
            )}
          </DialogActions>
        </Dialog>
        {bookingsRef.current?.length > 0 ? (
          bookingsRef.current?.map((booking, index) => (
            <Box key={index} sx={card}>
              <div className={styles.content}>
                <div className={styles.settings}>
                  <SpeedDial
                    ariaLabel="SpeedDial tooltip example"
                    icon={<SettingsIcon fontSize="medium" />}
                    direction="down"
                    FabProps={{
                      sx: {
                        bgcolor: "#750550",
                        width: "45px",
                        height: "45px",

                        "&:hover": {
                          bgcolor: "#750550",
                        },
                      },
                    }}
                  >
                    <SpeedDialAction
                      icon={
                        <ChatIcon
                          onClick={() =>
                            booking.status === "cancelled"
                              ? null
                              : handleChat(booking.roomId)
                          }
                        />
                      }
                      tooltipTitle={"Group Chat"}
                    />

                    {user.role === "model" && (
                      <SpeedDialAction
                        icon={
                          <DeleteForeverIcon
                            onClick={() =>
                              handleClickOpenDia(
                                user._id,
                                booking.roomId,
                                booking.bookerId,
                                false,
                                "",
                                booking.bookingID,
                                booking.accepted
                              )
                            }
                          />
                        }
                        tooltipTitle={"Decline & Remove"}
                      />
                    )}
                    {user.role === "client" && (
                      <SpeedDialAction
                        icon={
                          <DeleteForeverIcon
                            onClick={() =>
                              handleClickOpenDia(
                                booking,
                                booking.roomId,
                                booking.bookerId,
                                true,
                                undefined,
                                booking.bookingID
                              )
                            }
                          />
                        }
                        tooltipTitle={"Cancel Booking"}
                      />
                    )}
                    <SpeedDialAction
                      icon={
                        reported !== booking.roomId ? (
                          <ReportIcon onClick={() => reportBooking(booking)} />
                        ) : (
                          <CheckCircleOutlineIcon />
                        )
                      }
                      tooltipTitle={
                        reported === booking.roomId ? "Reported" : "Report"
                      }
                    />
                  </SpeedDial>
                </div>

                {booking.status === "cancelled" ? (
                  ""
                ) : (
                  <div className={styles.contact}>
                    <ContactPhoneIcon
                      fontSize="large"
                      style={{ color: "#750550", cursor: "pointer" }}
                      id="basic-button"
                      aria-controls={open ? "basic-menu" : undefined}
                      aria-haspopup="true"
                      aria-expanded={open ? "true" : undefined}
                      onClick={handleClick}
                    />

                    <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
                      <MenuItem
                        style={{
                          fontSize: "1.1em",
                          textTransform: "capitalize",
                        }}
                        onClick={handleClose}
                      >
                        {booking.nameMain} ~{" "}
                        <span
                          style={{
                            fontSize: "0.8em",
                            textTransform: "capitalize",
                            marginLeft: "5px",
                          }}
                        >
                          {" "}
                          Primary
                        </span>
                      </MenuItem>
                      <MenuItem onClick={handleClose}>
                        <LocalPhoneIcon style={{ marginRight: "10px" }} />
                        {booking.mobileMain}
                      </MenuItem>
                      <MenuItem onClick={handleClose}>
                        <EmailIcon style={{ marginRight: "10px" }} />
                        {booking.emailSec}
                      </MenuItem>
                      <MenuItem
                        style={{
                          fontSize: "1.1em",
                          textTransform: "capitalize",
                        }}
                        onClick={handleClose}
                      >
                        {booking.nameSec} ~{" "}
                        <span
                          style={{
                            fontSize: "0.8em",
                            textTransform: "capitalize",
                            marginLeft: "5px",
                          }}
                        >
                          Secondary
                        </span>
                      </MenuItem>
                      <MenuItem onClick={handleClose}>
                        <LocalPhoneIcon style={{ marginRight: "10px" }} />
                        {booking.mobileSec}
                      </MenuItem>
                      <MenuItem onClick={handleClose}>
                        <EmailIcon style={{ marginRight: "10px" }} />
                        {booking.emailSec}
                      </MenuItem>
                    </Menu>
                  </div>
                )}

                <span className={styles.name}>
                  {user.role === "client" &&
                    moment(booking.start).format("ddd, MMM Do")}
                </span>

                <span
                  className={styles.name}
                  style={{
                    color:
                      booking.status === "cancelled"
                        ? "#0505050c"
                        : "rgb(82, 82, 82)",
                  }}
                >
                  {user.role === "model" && booking.nameMain}
                </span>
                <span className={styles.state}>
                  {booking.status === "requested" &&
                    booking.bookedGirls.length !== booking.accepted.length &&
                    `Waiting for all models to accept ${booking.accepted.length}/${booking.bookedGirls.length}`}

                  {booking.bookedGirls.length === booking.accepted.length &&
                    user.role === "model" &&
                    booking.status === "requested" &&
                    "Waiting for client to pay deposit"}

                  {booking.bookedGirls.length === booking.accepted.length &&
                    user.role === "client" &&
                    booking.status === "requested" &&
                    booking.bookedGirls.length > 0 &&
                    booking.accepted.length > 0 &&
                    "Please confirm booking by paying deposit"}

                  {booking.bookedGirls.length === booking.accepted.length &&
                    user.role === "client" &&
                    booking.status === "requested" &&
                    booking.bookedGirls.length === 0 &&
                    booking.accepted.length === 0 &&
                    "Please add models to booking"}

                  {booking.status === "cancelled" && "Cancelled"}
                  {booking.status === "add-requested" &&
                    "A new model has been added to the booking"}

                  <span style={{ fontSize: "1.1em" }}>
                    {booking.status === "confirmed" &&
                      "Booking has been confirmed"}
                    <br />
                  </span>
                </span>

                {booking.bookedGirls.length === booking.accepted.length &&
                  user.role === "client" &&
                  booking.status === "requested" &&
                  booking.bookedGirls.length > 0 &&
                  booking.accepted.length > 0 && (
                    <div className={styles.accept}>
                      <Button
                        onClick={() => convertFee(booking)}
                        color="secondary"
                      >
                        Confirm Booking
                      </Button>
                    </div>
                  )}

                {user.role === "model" && booking.status !== "cancelled" ? (
                  booking.accepted.find(
                    (item) => item._id.toString() === user._id
                  ) ? (
                    ""
                  ) : (
                    <div className={styles.accept}>
                      <Button
                        onClick={() =>
                          handleAccept(
                            user._id,
                            user.fName,
                            user.lName,
                            booking.roomId,
                            booking.bookerId,
                            fee,
                            localStorage.getItem("wallet"),
                            booking.currency
                          )
                        }
                        color="secondary"
                      >
                        Accept job
                      </Button>
                      <TextField
                        onChange={(e) => setFee(e.target.value)}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              {user.fiat}
                            </InputAdornment>
                          ),
                        }}
                        type="number"
                        variant="standard"
                        placeholder="Whats your fee ?"
                      />
                    </div>
                  )
                ) : null}

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-around",
                  }}
                >
                  {modelToAdd && (
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                      }}
                    >
                      <Avatar
                        sx={avatarsadd}
                        alt={modelToAdd.fName}
                        src={modelToAdd.thumbnail}
                      />

                      <Button
                        sx={{ padding: "0 7px 0 0", fontSize: "0.8em" }}
                        onClick={() =>
                          addModelToBooking(
                            modelToAdd,
                            booking.roomId,
                            booking.bookerId
                          )
                        }
                      >
                        Add
                      </Button>
                    </div>
                  )}
                  <AvatarGroup
                    max={8}
                    total={booking.bookedGirls.length}
                    sx={{
                      margin: "1em auto",
                      opacity: booking.status === "cancelled" ? "0.1" : "1",
                    }}
                  >
                    {booking.bookedGirls.map((thumb, index) => (
                      <div
                        key={index}
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                        }}
                      >
                        <Link
                          href="/models/[id]"
                          as={decodeURIComponent(
                            `/models/${thumb.fName?.toLocaleLowerCase()}-${thumb.lName.toLocaleLowerCase()}?id=${
                              thumb._id
                            }`
                          )}
                        >
                          <a>
                            <Avatar
                              style={{
                                border: booking.accepted.find(
                                  (_model) =>
                                    _model._id.toString() === thumb._id
                                )
                                  ? "4px solid green"
                                  : "3px solid red",
                              }}
                              sx={avatars}
                              alt="Natacha"
                              src={
                                thumb.thumbnail
                                  ? thumb.thumbnail
                                  : thumb.photos?.filter(
                                      (item) => item.thumbnail === true
                                    )[0].url
                              }
                            />
                          </a>
                        </Link>

                        {user.role === "client" && (
                          <Button
                            sx={{ padding: "0 7px 0 0", fontSize: "0.8em" }}
                            onClick={() =>
                              handleClickOpenDia(
                                thumb._id,
                                booking.roomId,
                                booking.bookerId,
                                "removeModel",
                                booking.status
                              )
                            }
                          >
                            Remove
                          </Button>
                        )}
                      </div>
                    ))}
                  </AvatarGroup>
                </div>

                {booking.status === "confirmed" && user.role === "model" && (
                  <span className={styles.paymentInfo}>
                    Present this QR Code to the client to complete your payment{" "}
                  </span>
                )}

                {booking.status === "confirmed" && user.role === "model" && (
                  <>
                    <Link
                      href="/pay"
                      as={decodeURIComponent(
                        `/pay/?wallet=${localStorage.getItem("wallet")}&fee=${
                          booking.accepted[
                            findIndex(booking.accepted, {
                              _id: user._id,
                            })
                          ]?.feeFiat.fee
                        }&currency=${
                          booking.accepted[
                            findIndex(booking.accepted, {
                              _id: user._id,
                            })
                          ]?.feeFiat.currency
                        }&name=${
                          user.fName + " " + user.lName
                        }&index=${findIndex(booking.accepted, {
                          _id: user._id,
                        })}&bookId=${booking.bookingID}&id=${user._id}&photo=${
                          booking.bookedGirls
                            .filter((thumb, index) => thumb._id === user._id)[0]
                            .photos?.filter(
                              (item) => item.thumbnail === true
                            )[0].url
                            ? booking.bookedGirls
                                .filter(
                                  (thumb, index) => thumb._id === user._id
                                )[0]
                                .photos?.filter(
                                  (item) => item.thumbnail === true
                                )[0].url
                            : booking.bookedGirls.filter(
                                (thumb, index) => thumb._id === user._id
                              )[0].thumbnail
                        }`
                      )}
                    >
                      <QRCode
                        style={{ margin: "0 auto 3em auto" }}
                        value={`/pay/?wallet=${localStorage.getItem(
                          "wallet"
                        )}&fee=${
                          booking.accepted[
                            findIndex(booking.accepted, {
                              _id: user._id,
                            })
                          ]?.feeFiat.fee
                        }&currency=${
                          booking.accepted[
                            findIndex(booking.accepted, {
                              _id: user._id,
                            })
                          ]?.feeFiat.currency
                        }&name=${
                          user.fName + " " + user.lName
                        }&index=${findIndex(booking.accepted, {
                          _id: user._id,
                        })}&bookId=${booking.bookingID}&id=${user._id}&photo=${
                          booking.bookedGirls
                            .filter((thumb, index) => thumb._id === user._id)[0]
                            .photos?.filter(
                              (item) => item.thumbnail === true
                            )[0].url
                            ? booking.bookedGirls
                                .filter(
                                  (thumb, index) => thumb._id === user._id
                                )[0]
                                .photos?.filter(
                                  (item) => item.thumbnail === true
                                )[0].url
                            : booking.bookedGirls.filter(
                                (thumb, index) => thumb._id === user._id
                              )[0].thumbnail
                        }`}
                      />
                    </Link>
                  </>
                )}

                {booking.status === "confirmed" && user.role === "model" && (
                  <span className={styles.paymentAd}>
                    {" "}
                    Every completed booking (scanned QR Code) automatically
                    enters you into the weekly lottery to win a prize pool, You
                    also naturally appear higher in search results with the more
                    completed bookings you have
                  </span>
                )}
                {booking.status === "confirmed" && user.role === "client" && (
                  <span className={styles.paymentAd}>
                    {" "}
                    Every completed booking automatically enters you into the
                    weekly lottery to win a prize pool. We also automatically
                    donate 5% of our fee costs into the lottery pool on
                    completion of all bookings.
                  </span>
                )}

                <span
                  className={styles.start}
                  style={{
                    color:
                      booking.status === "cancelled"
                        ? "#0505050c"
                        : "rgb(82, 82, 82)",
                  }}
                >
                  <span style={{ fontWeight: "bold" }}>Start:</span>{" "}
                  {moment(booking.start).format("HH:mm")} -{" "}
                  {moment(booking.start).format("dddd MMM Do YYYY")}
                </span>
                <span
                  className={styles.start}
                  style={{
                    color:
                      booking.status === "cancelled"
                        ? "#0505050c"
                        : "rgb(82, 82, 82)",
                  }}
                >
                  <span style={{ fontWeight: "bold" }}>Finish:</span>{" "}
                  {moment(booking.finish).format("HH:mm")} -{" "}
                  {moment(booking.finish).format("dddd MMM Do YYYY")}
                </span>
                <span className={styles.address}>
                  <hr stlye={{ margin: "1em auto" }} />

                  {booking?.address?.description ? (
                    <>
                      <span style={{ fontWeight: "bold" }}>Location: </span>
                      {booking?.address?.description}
                    </>
                  ) : (
                    booking?.address?.address
                  )}

                  {booking.vessel && (
                    <>
                      <span style={{ fontWeight: "bold" }}>Vessel: </span>
                      {booking.vessel}
                    </>
                  )}
                  <br />

                  {booking.wharfPickUp && (
                    <>
                      <span style={{ fontWeight: "bold" }}>
                        Pick Up Wharf:{" "}
                      </span>
                      {booking.wharfPickUp}
                    </>
                  )}
                  <br />

                  {booking.wharfDropOff && (
                    <>
                      <span style={{ fontWeight: "bold" }}>
                        Drop Off Wharf:{" "}
                      </span>
                      {booking.wharfDropOff}
                    </>
                  )}
                </span>
                <Accordion
                  sx={accordion}
                  style={{
                    opacity: booking.status === "cancelled" ? "0.1" : "1",
                  }}
                >
                  <AccordionSummary sx={title} expandIcon={<ExpandMoreIcon />}>
                    <Typography sx={viewDets}>See Full Details</Typography>
                  </AccordionSummary>
                  <AccordionDetails sx={details}>
                    <span style={{ fontWeight: "bold" }}>Guests: </span>
                    {booking.paxs} guests &{" "}
                    {booking.gender === "female"
                      ? "All females"
                      : booking.gender === "male"
                      ? "All males"
                      : booking.gender === "mixed"
                      ? "Mixed genders"
                      : null}
                    <br />
                    <p>
                      <span style={{ fontWeight: "bold" }}>The event: </span>
                      {booking.description}
                    </p>
                  </AccordionDetails>
                </Accordion>
              </div>
            </Box>
          ))
        ) : (
          <h1 className={styles.noBookings}>No Bookings</h1>
        )}
      </div>
    </>
  );
};

export default Bookings;
