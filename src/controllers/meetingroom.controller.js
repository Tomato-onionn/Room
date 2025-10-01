const meetingRoomService = require("../services/meetingroom.service");

class MeetingRoomController {
  async getAllRooms(req, res) {
    try {
      const rooms = await meetingRoomService.getAllRooms(req.query);
      res.json(rooms);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getRoomById(req, res) {
    try {
      const room = await meetingRoomService.getRoomById(req.params.id);
      res.json(room);
    } catch (error) {
      if (error.message === "Room not found") {
        return res.status(404).json({ error: error.message });
      }
      res.status(500).json({ error: error.message });
    }
  }

  async createRoom(req, res) {
    try {
      const newRoom = await meetingRoomService.createRoom(req.body);
      res.status(201).json(newRoom);
    } catch (error) {
      if (error.message.includes("Missing required fields")) {
        return res.status(400).json({ error: error.message });
      }
      res.status(500).json({ error: error.message });
    }
  }

  async updateRoom(req, res) {
    try {
      const updatedRoom = await meetingRoomService.updateRoom(req.params.id, req.body);
      res.json(updatedRoom);
    } catch (error) {
      if (error.message === "Room not found") {
        return res.status(404).json({ error: error.message });
      }
      res.status(500).json({ error: error.message });
    }
  }

  async deleteRoom(req, res) {
    try {
      const result = await meetingRoomService.deleteRoom(req.params.id);
      res.json(result);
    } catch (error) {
      if (error.message === "Room not found") {
        return res.status(404).json({ error: error.message });
      }
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new MeetingRoomController();