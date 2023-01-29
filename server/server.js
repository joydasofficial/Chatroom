const app = require("express")();
const server = require("http").createServer(app);

const cors = require("cors");

const io = require("socket.io")(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const PORT = process.env.PORT || 8000;

app.use(cors());

app.get("/", (req, res) => {
  res.send("Server is live...");
});

io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("join-room", ({room, username})=>{
    socket.join(room)
    let createdtime = Date.now();

    socket.to(room).emit('receive-msg', {
      message: `${username} joined the room`,
      username,
      createdtime,
    })

    socket.emit('receive-msg', {
      message: `Welcome ${username}`,
      username,
      createdtime,
    })
  })

  socket.on("chat-message", (data) => {
    io.emit("chat-message", data);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });

  socket.on("calluser", ({ signal, callFrom, userToCall, name }) => {
    io.to(userToCall).emit("calluser", { signal, callFrom, name });
  });

  socket.on("answercall", ({ signal, answerTo }) => {
    console.log(signal, answerTo);
    io.to(answerTo).emit("callaccepted", signal);
  });
});

server.listen(PORT, () => {
  console.log(`Server is listening on ${PORT}`);
});
