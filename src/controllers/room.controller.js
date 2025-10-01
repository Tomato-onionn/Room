const db = require("../models");  // Sequelize index.js
const Room = db.Room;             // Lấy model Room từ index

// Lấy danh sách tất cả room
exports.getAllRooms = async (req, res) => {
  try {
    const rooms = await Room.findAll();
    res.json({
      success: true,
      data: rooms,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Lấy 1 room theo id
exports.getRoomById = async (req, res) => {
  try {
    const { id } = req.params;
    const room = await Room.findByPk(id);

    if (!room) {
      return res.status(404).json({ success: false, message: "Room not found" });
    }

    res.json({ success: true, data: room });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Tạo room mới
exports.createRoom = async (req, res) => {
  try {
    const newRoom = await Room.create(req.body);
    res.status(201).json({ success: true, data: newRoom });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Cập nhật room
exports.updateRoom = async (req, res) => {
  try {
    const { id } = req.params;
    const [updated] = await Room.update(req.body, { where: { id } });

    if (!updated) {
      return res.status(404).json({ success: false, message: "Room not found" });
    }

    const updatedRoom = await Room.findByPk(id);
    res.json({ success: true, data: updatedRoom });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Xóa room
exports.deleteRoom = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Room.destroy({ where: { id } });

    if (!deleted) {
      return res.status(404).json({ success: false, message: "Room not found" });
    }

    res.json({ success: true, message: "Room deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
