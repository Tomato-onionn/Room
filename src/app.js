const express = require("express");
const cors = require("cors");
const swaggerDocs = require("./config/swagger");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
const meetingRoomsRoutes = require("./routes/meetingrooms.routes");
const meetingRoomDetailsRoutes = require("./routes/meetingroomdetails.routes");
const meetingHistoryRoutes = require("./routes/meetinghistory.routes");

app.use("/api/meetingrooms", meetingRoomsRoutes);
app.use("/api/room-details", meetingRoomDetailsRoutes);
app.use("/api/meeting-history", meetingHistoryRoutes);

// Swagger Docs
swaggerDocs(app);

module.exports = app;
