import socketIOClient from "socket.io-client";
const socket = socketIOClient(`${process.env.REACT_APP_BACKEND_IP}`);
export default socket;
