import socketIOClient from "socket.io-client";
const socket = socketIOClient(`${process.env.REACT_APP_BACKEND_IP||'localhost:7777'}`);
export default socket;
