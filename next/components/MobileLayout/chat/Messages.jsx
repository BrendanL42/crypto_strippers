import React, { useEffect, useContext } from "react";
import useState from "react-usestateref";
import ScrollToBottom from "react-scroll-to-bottom";
import styles from "../../../styles/Chat.module.css";
import axios from "axios";
import AppContext from "../../../lib/AppContext";
import SendIcon from "@mui/icons-material/Send";
import moment from "moment";
import { Avatar, AvatarGroup } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/router";

const Messages = (props) => {
  const [currentMessage, setCurrentMessage] = useState("");
  const [booking, setBooking] = useState([]);
  const [messageList, setMessageList, messageListRef] = useState([]);

  const { user, socket, throwMessage } = useContext(AppContext);

  const router = useRouter();

  const [room, setRoom] = useState("");
  const [_user, set_User] = useState({});

  useEffect(() => {
    set_User(user);
  }, [user]);

  // set saved messages from db
  useEffect(() => {
    if (_user.role) {
      axios
        .get(
          `${process.env.NEXT_PUBLIC_REACT_APP_SERVER_URL}/${
            _user.role === "model" ? "model" : "client"
          }/read/bookings`
        )
        .then(async (res) => {
          const booking = res.data.bookings.filter(
            (booking) => booking.roomId === room
          );

          const messages = Array.from(booking);

          setBooking(booking);
          setMessageList(messages[0].messageList);
        })
        .catch((error) => {
          if (
            error.message !==
              "undefined is not an object (evaluating 'messages[0].messageList')" &&
            error.message !==
              "Cannot read properties of undefined (reading 'messageList')"
          ) {
            throwMessage("error", "Something went wrong 1", 3000);
          }
        });
    }
  }, [_user]);

  useEffect(() => {
    setRoom(router.query.room);
  }, [router.isReady]);

  useEffect(() => {
    function removeStorage() {
      localStorage.removeItem(router.query.room);
      localStorage.removeItem("room");
    }

    if (
      localStorage.getItem(router.query.room) ||
      localStorage.removeItem("room")
    ) {
      removeStorage();
    }

    return removeStorage;
  }, []);

  // send a new message
  const sendMessage = async () => {
    if (currentMessage !== "") {
      const url = user.photos?.filter((item) => item.thumbnail === true)[0].url;
      const urlClient = user?.photo;
      const messageData = {
        url: user.role === "model" ? url : urlClient,
        room: room,
        author: user.fName + "." + user.lName,
        message: currentMessage,
        time: new Date(Date.now()),
      };

      await socket.emit("send_message", messageData);
      setMessageList((list) => [...list, messageData]);
      setCurrentMessage("");
    }
  };

  useEffect(() => {
    if (socket) {
      socket.on("message", (data) => {
        setMessageList((list) => [...list, data]);
      });
    }
  }, [socket]);

  return (
    <>
      <div className={styles.background}>
        <div className={styles.wrapper}>
          <div className={styles.chatWindow}>
            <div className={styles.avatars}>
              <AvatarGroup max={5}>
                {booking[0]?.bookedGirls.map((thumb, index) => (
                  <Link
                    key={index}
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
                          border: booking[0].accepted.find(
                            (_model) => _model._id.toString() === thumb._id
                          )
                            ? "3px solid green"
                            : "2px solid red",
                        }}
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
                    </a>
                  </Link>
                ))}
              </AvatarGroup>

              <span>{moment(booking[0]?.start).format("MMM ddd Do")}</span>
            </div>
            <div className={styles.chatBody}>
              <ScrollToBottom className={styles.messageContainer}>
                {messageListRef.current?.length ? (
                  Array.from(new Set(messageListRef.current)).map(
                    (messageContent, i) => {
                      return (
                        <div
                          key={i}
                          className={styles.message}
                          id={
                            user.fName ===
                              messageContent.author.split(".")[0] &&
                            messageContent.author.split(".")[1] ===
                              user.lName.split(0)[0]
                              ? styles.you
                              : styles.other
                          }
                        >
                          <div style={{ display: "flex" }}>
                            <div
                              style={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                              }}
                            >
                              <Avatar
                                sx={{
                                  width: 40,
                                  height: 40,
                                  margin: "3px 0 0 0 ",
                                }}
                                alt="Natacha"
                                src={messageContent?.url}
                              />
                              <p id={styles.author}>
                                {messageContent.author?.split(".")[0]}
                              </p>
                            </div>

                            <div>
                              <div className={styles.messageContent}>
                                <p>{messageContent.message}</p>
                              </div>

                              <div className={styles.messageMeta}>
                                <p
                                  id={styles.time}
                                  style={{ margin: "0 auto" }}
                                >
                                  {moment(messageContent.time).format("HH:mm")}{" "}
                                  -{" "}
                                  {moment(messageContent.time).format("ddd Do")}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    }
                  )
                ) : (
                  <h5
                    style={{
                      textAlign: "center",
                      fontSize: "1.1em",
                      marginTop: "5em",
                    }}
                  >
                    No Messages
                  </h5>
                )}
              </ScrollToBottom>
            </div>

            <div className={styles.chatFooter}>
              
              <input
                type="text"
                value={currentMessage}
                placeholder="Type message..."
                onChange={(event) => {
                  setCurrentMessage(event.target.value);
                }}
                onKeyPress={(event) => {
                  event.key === "Enter" && sendMessage();
                }}
              />
              <div className={styles.send}>
                <SendIcon fontSize="large" onClick={sendMessage} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Messages;
