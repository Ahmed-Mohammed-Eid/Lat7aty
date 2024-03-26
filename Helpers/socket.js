import {io} from "socket.io-client";

let socket = null;

export function initIo() {
    socket = io("wss://api.lathaty.com", {
        transports: ["websocket", "polling"],
    });

    socket.on("connect", () => {
        console.log("connected");
    });
}


export function getIo() {
    if (!socket) {
        initIo();
    }
    return socket;
}
