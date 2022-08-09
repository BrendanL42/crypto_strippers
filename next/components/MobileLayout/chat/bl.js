import { useEffect, useState, useContext } from "react";
import AppContext from "../../../lib/AppContext";

const bl = () => {
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");
  const [currentMessage, setCurrentMessage] = useState("");
  const [messageList, setMessageList, messageListRef] = useState([]);
  const { user, throwMessage, socket } = useContext(AppContext);

  // send a new message
  const sendMessage = async () => {
    if (currentMessage !== "") {
      const url = user.photos?.filter((item) => item.thumbnail === true)[0].url;
      const urlClient = user?.photo;
      const messageData = {
        url: user.role === "model" ? url : urlClient,
        room: room,
        author: username,
        message: currentMessage,
        time: new Date(Date.now()),
      };

      await socket.emit("send_message", messageData);
      setMessageList((list) => [...list, messageData]);
      setCurrentMessage("");
    }
  };

  // listen for new message
  useEffect(() => {
    if (socket) {
      socket.on("message", (data) => {
        setMessageList((list) => [...list, data]);
        messageListRef.current.map((item) => console.log(item.message));
        throwMessage("info", data.message);
      });
    }
  }, [socket]);

  return {
    sendMessage,
    username,
    setUsername,
    room,
    setRoom,
    currentMessage,
    setCurrentMessage,
    user,
    setMessageList,
    messageListRef,
  };
};

export default bl;
