// how to
// npm init enter enter enter....
// npm i socket.io-client
// node scriptname.js

const { io } = require("socket.io-client");
const URL = 'wss://url.com.br';
const PATH = '/path'
const MAX_CLIENTS = 15000; 
const CLIENT_CREATION_INTERVAL_IN_MS = 1; 
const EMIT_INTERVAL_IN_MS = 1000; 
let clientCount = 0;
let lastReport = new Date().getTime();
let packetsSinceLastReport = 0;
const createClient = () => {
  const transports = ["websocket"];
  const socket = io(URL, {
    transports,
    path: PATH,
  });
  setInterval(() => {
    socket.emit("client to server event");
  }, EMIT_INTERVAL_IN_MS);
  socket.on("server to client event", () => {
    packetsSinceLastReport++;
  });
  socket.io.on("error", (error) => {
    console.log(error || 'connect_failed');
  });
  socket.on("disconnect", (reason) => {
    console.log(`disconnect due to ${reason}`);
  });
  socket.on("connect", () => {
    console.log(`Socket connected: ${socket.id}`);
  });
  if (++clientCount < MAX_CLIENTS) {
    setTimeout(createClient, CLIENT_CREATION_INTERVAL_IN_MS);
  }
};
createClient();
const printReport = () => {
  const now = new Date().getTime();
  const durationSinceLastReport = (now - lastReport) / 1000;
  const packetsPerSeconds = (
    packetsSinceLastReport 
  ).toFixed(2);
  console.log(
    `client count: ${clientCount} ;`
  );
  packetsSinceLastReport = 0;
  lastReport = now;
};
setInterval(printReport, 5000);
