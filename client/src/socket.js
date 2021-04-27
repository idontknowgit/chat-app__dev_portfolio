import { io } from "socket.io-client";

let socket = null;

const getSocket = () => {
  if (!socket) {
    socket = io("/");
  }
  return socket;
};

export default getSocket;
