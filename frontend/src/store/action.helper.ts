import socketIOClient from "socket.io-client";
const socket = socketIOClient('http://localhost:7777');
export default socket;

// export const createService = (data: any) => {
//     socket.emit('create_new_service', data);
// }


// export const listenToSuperCritcalEvents = () => {
//     socket.on('SUPER_CRITICAL', () => {

//     });
// }

// export const listenToSubCritcalEvents = () => {
//     socket.on('SUB_CRITICAL', () => {

//     });
// }

// export const listenToHealthyEvents = () => {
//     socket.on('HEALTHY_PING', () => {

//     });
// }
