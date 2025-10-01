var DataTypes = require("sequelize").DataTypes;
var _meetinghistory = require("./meetinghistory");
var _meetingroom = require("./meetingroom");
var _meetingroomdetail = require("./meetingroomdetail");

function initModels(sequelize) {
  var meetinghistory = _meetinghistory(sequelize, DataTypes);
  var meetingroom = _meetingroom(sequelize, DataTypes);
  var meetingroomdetail = _meetingroomdetail(sequelize, DataTypes);

  meetinghistory.belongsTo(meetingroom, { as: "room", foreignKey: "room_id"});
  meetingroom.hasMany(meetinghistory, { as: "meetinghistories", foreignKey: "room_id"});
  meetingroomdetail.belongsTo(meetingroom, { as: "room", foreignKey: "room_id"});
  meetingroom.hasMany(meetingroomdetail, { as: "meetingroomdetails", foreignKey: "room_id"});

  return {
    meetinghistory,
    meetingroom,
    meetingroomdetail,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
