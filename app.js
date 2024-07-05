const { log } = require("console");
const express = require("express");
const app = express();
const http = require("http");
const path = require("path");
const socketio = require("socket.io");

const server = http.createServer(app);
const io = socketio(server);

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "/public")));

io.on("connection", (socket) => {
  log("New WS Connection", socket.id);

  socket.on("sendLocation", (coords) => {
    console.log("Received location from", socket.id, coords); // Debug log
    io.emit("receiveLocation", { id: socket.id, ...coords });
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id); // Debug log
    io.emit("userDisconnect", socket.id);
  });
});

app.get("/", (req, res) => {
  res.render("index");
});

server.listen(3000, () => {
  console.log("Server is running on port 3000");
});
