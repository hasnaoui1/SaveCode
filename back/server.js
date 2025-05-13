const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { sequelize } = require("./models");
const http = require('http')
dotenv.config();

const server = express();

const httpServer = http.createServer(server);

server.use(express.json());
server.use(cors());


sequelize.authenticate()
  .then(() => console.log("Connected to the database"))
  .catch((err) => console.error("Database connection error:", err));


sequelize.sync({ alter: true })
  .then(() => console.log("Database synced"))
  .catch((err) => console.error("Error syncing database:", err));

server.get("/", (req, res) => {
  res.send("Hello world");
});


require("./api.routes")(server);

require('./socketio')(httpServer)

httpServer.listen(process.env.PORT, () => {
  console.log("Server running on http://localhost:" + process.env.PORT);
});
