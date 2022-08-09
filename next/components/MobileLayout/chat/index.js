import { useContext, useEffect, useState } from "react";
import AppContext from "../../../lib/AppContext";
import axios from "axios";
import styles from "../../../styles/AllMessages.module.css";

import { List, Avatar, AvatarGroup, Badge } from "@mui/material";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import ListSubheader from "@mui/material/ListSubheader";
import Switch from "@mui/material/Switch";
import moment from "moment";
import Link from "next/link";
import EmailIcon from "@mui/icons-material/Email";

const AllMessages = () => {
  const { user, throwMessage, socket } = useContext(AppContext);
  const [bookings, setBookings] = useState([]);
  const userId = user ? user.fName + "." + user.lName : "";

  useEffect(() => {
    if (socket) {
      socket.on("message", (data) => {});
    }
  }, [socket]);

  const handleToggle = (value, status) => () => {
    axios
      .put(`${process.env.NEXT_PUBLIC_REACT_APP_SERVER_URL}/bookings/mute`, {
        notifications: status ? false : true,
        room: value,
        user: user._id,
        who: user.role === "model" ? "model" : "client",
      })
      .then((res) => {
        getBookings();
        throwMessage(
          "success",
          `Email notifications ${status ? "off" : "on"}`,
          3000
        );
      })
      .catch(() => {
        throwMessage("error", "Something went wrong", 3000);
      });
  };

  useEffect(() => {
    if (user._id) {
      getBookings();
    }
  }, [user]);

  const getBookings = () => {
    axios
      .get(
        `${process.env.NEXT_PUBLIC_REACT_APP_SERVER_URL}/${
          user.role === "model" ? "model" : "client"
        }/read/bookings`
      )
      .then((res) => {
        setBookings(res.data.bookings);
      })
      .catch((error) => {
        throwMessage("error", "Something went wrong", 3000);
      });
  };

  return (
    <div className={styles.wrapper}>
      <List
        sx={{
          width: "100%",
          bgcolor: "background.paper",
          padding: "0",
          color: "black",
        }}
        subheader={
          <ListSubheader
            sx={{
              fontSize: "1.1em",
              fontWeight: "300",
              margin: "0 0 1em 1em",
            }}
          >
            {bookings?.length !== 0 ? "All Messages" : ""}
          </ListSubheader>
        }
      >
        {bookings?.length !== 0 ? (
          bookings?.map((booking, index) => (
            <ListItem
              key={index}
              sx={{
                borderBottom: "1px solid grey",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <ListItemIcon sx={{ display: "flex", alignItems: "center" }}>
                {user.role === "client" ? (
                  <AvatarGroup
                    total={booking?.bookedGirls.length}
                    sx={{ margin: "1em auto" }}
                  >
                    {booking?.bookedGirls.map((thumb, index) => (
                      <Avatar
                        style={{
                          border: booking.accepted.find(
                            (_model) => _model._id.toString() === thumb._id
                          )
                            ? "3px solid green"
                            : "2px solid red",
                        }}
                        key={index}
                        sx={{ width: 60, height: 60 }}
                        alt="Natacha"
                        src={
                          thumb.thumbnail
                            ? thumb.thumbnail
                            : thumb.photos?.filter(
                                (item) => item.thumbnail === true
                              )[0].url
                        }
                      />
                    ))}
                  </AvatarGroup>
                ) : (
                  <Avatar
                    sx={{ width: 60, height: 60, marginRight: "0.5em" }}
                    alt="Natacha"
                    src={booking.bookerUrl}
                  />
                )}
                <Link
                  href="/[name]/messages/[room]"
                  as={`/${user.fName}-${user.lName}/messages/${booking.roomId}?userId=${userId}`}
                >
                  <a>
                    {user.role === "model" ? (
                      <ListItemText>
                        <span className={styles.name}>
                          {booking.nameMain.split(" ")[0]}
                        </span>
                        <span className={styles.date}>
                          {moment(booking.start).format("MMM Do-HH:mm")}
                        </span>
                      </ListItemText>
                    ) : (
                      <ListItemText>
                        <span className={styles.date}>
                          {moment(booking.start).format("MMM Do-HH:mm")}
                        </span>
                      </ListItemText>
                    )}
                  </a>
                </Link>
              </ListItemIcon>
              {localStorage.getItem(booking.roomId) ? (
                <Badge badgeContent={"New"} color="primary">
                  <EmailIcon
                    sx={{ color: "grey", marginLeft: "10px" }}
                    fontSize="large"
                  />
                </Badge>
              ) : null}
              <Switch
                onChange={handleToggle(booking.roomId, booking.notifications)}
                checked={booking.notifications}
                inputProps={{
                  "aria-labelledby": "Turn off Notifactions",
                }}
              />
            </ListItem>
          ))
        ) : (
          <h1 className={styles.noBookings}>No Messages</h1>
        )}
      </List>
    </div>
  );
};

export default AllMessages;
