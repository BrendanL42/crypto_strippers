import React, { useEffect } from "react";
import useSocket from  "../components/MobileLayout/chat/useSocket"


const joinRoom = () => {

    const socket = useSocket("http://localhost:3001", "username", "fsg7q1p3");

    const joinRooms = () => {
      if (socket) {
        socket.emit("join_room", "fsg7q1p3");
      }
    };
  


  return {joinRooms}
};

export default joinRoom;
