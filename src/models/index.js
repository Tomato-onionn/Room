const { Sequelize, DataTypes } = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: "mysql",
    logging: false,
  }
);

const db = {};

db.MeetingRoom = require("./meetingroom")(sequelize, DataTypes);
db.MeetingHistory = require("./meetinghistory")(sequelize, DataTypes);
db.MeetingRoomDetail = require("./meetingroomdetail")(sequelize, DataTypes);

// Thiết lập associations
db.MeetingRoom.hasOne(db.MeetingRoomDetail, {
  foreignKey: 'room_id',
  as: 'details'
});

db.MeetingRoom.hasMany(db.MeetingHistory, {
  foreignKey: 'room_id',
  as: 'history'
});

db.MeetingRoomDetail.belongsTo(db.MeetingRoom, {
  foreignKey: 'room_id',
  as: 'room'
});

db.MeetingHistory.belongsTo(db.MeetingRoom, {
  foreignKey: 'room_id',
  as: 'room'
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
