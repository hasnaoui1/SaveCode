const socketIO = require('socket.io')
const jwt = require('jsonwebtoken')

// backend/index.js (or wherever your socket setup is)
module.exports = (httpServer) => {
    let connectedUsers = [];
    const io = socketIO(httpServer, {
      cors: {
        origin: "http://localhost:5173",
        methods: ["POST", "GET"],
      },
    });
  
    io.on("connection", (socket) => {
      console.log("Socket connected", socket.id);
  
      socket.on("setup", (token) => {
        if (token) {
          let user = jwt.verify(token, process.env.JWT_SECRET || "123");
          if (user) {
            setUser(user.id, socket.id);
            io.emit("connectedUsers", connectedUsers.map((x) => x.id));
          }
        }
      });
  
      socket.on("disconnect", () => {
        console.log(socket.id, "disconnected");
        removeUser(socket.id);
        io.emit("connectedUsers", connectedUsers.map((x) => x.id));
      });
  
      socket.on("collabRequest", ({ toUserId, snippetId }) => {
        const targetSocketId = getUserSid(toUserId);
        if (targetSocketId) {
          io.to(targetSocketId).emit("incomingCollabRequest", {
            snippetId,
            fromUserId: connectedUsers.find((u) => u.sid === socket.id)?.id,
          });
        } else {
          console.log("Target user not connected");
        }
      });
  
      socket.on("collabAccepted", ({ snippetId, toUserId }) => {
        const requesterSocketId = getUserSid(toUserId);
        if (requesterSocketId) {
          const room = `snippet-${snippetId}`;
          socket.join(room);
          io.sockets.sockets.get(requesterSocketId).join(room);
          console.log(`Users joined room ${room}: ${socket.id}, ${requesterSocketId}`);
          io.to(room).emit("collabStarted", { snippetId });
        }
      });
  
      socket.on("codeChange", ({ snippetId, code }) => {
        const room = `snippet-${snippetId}`;
        console.log(`Received codeChange for ${room}: ${code}`);
        socket.to(room).emit("codeUpdate", code);
      });
  
      const setUser = (userId, socketId) => {
        let userIndex = connectedUsers.findIndex((u) => u.id == userId);
        if (userIndex == -1) {
          connectedUsers.push({ id: userId, sid: socketId });
        } else {
          connectedUsers[userIndex].sid = socketId;
        }
        console.log("connectedUsers", connectedUsers);
      };
  
      const getUserSid = (userId) => {
        let item = connectedUsers.find((u) => u.id == userId);
        return item ? item.sid : null;
      };
  
      const removeUser = (socketId) => {
        let userIndex = connectedUsers.findIndex((u) => u.sid == socketId);
        if (userIndex != -1) {
          connectedUsers.splice(userIndex, 1);
        }
      };
    });
  };