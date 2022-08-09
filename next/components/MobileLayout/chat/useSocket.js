import io from "socket.io-client";
import { useState, useEffect } from "react";

function useSocket(url, username, room) {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const socketIo = io(url);

    setSocket(socketIo);

    if (username !== "" && room !== "" && socket) {
      socket.emit("join_room", room);
    }

    function cleanup() {
      socketIo.disconnect();
    }
    return cleanup;
  }, []);

  return socket;
}

export default useSocket;
