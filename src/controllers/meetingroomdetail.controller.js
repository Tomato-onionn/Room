const meetingRoomDetailService = require("../services/meetingroomdetail.service");

class MeetingRoomDetailController {
  async getAllDetails(req, res) {
    try {
      const details = await meetingRoomDetailService.getAllDetails(req.query);
      res.json(details);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getDetailById(req, res) {
    try {
      const detail = await meetingRoomDetailService.getDetailById(req.params.id);
      res.json(detail);
    } catch (error) {
      if (error.message === "Detail not found") {
        return res.status(404).json({ error: error.message });
      }
      res.status(500).json({ error: error.message });
    }
  }

  async getDetailByRoomId(req, res) {
    try {
      const detail = await meetingRoomDetailService.getDetailByRoomId(req.params.roomId);
      res.json(detail);
    } catch (error) {
      if (error.message === "Detail not found for this room") {
        return res.status(404).json({ error: error.message });
      }
      res.status(500).json({ error: error.message });
    }
  }

  async createDetail(req, res) {
    try {
      const newDetail = await meetingRoomDetailService.createDetail(req.body);
      res.status(201).json(newDetail);
    } catch (error) {
      if (error.message.includes("Missing required fields") || error.message === "Room not found") {
        return res.status(400).json({ error: error.message });
      }
      res.status(500).json({ error: error.message });
    }
  }

  async updateDetail(req, res) {
    try {
      const updatedDetail = await meetingRoomDetailService.updateDetail(req.params.id, req.body);
      res.json(updatedDetail);
    } catch (error) {
      if (error.message === "Detail not found") {
        return res.status(404).json({ error: error.message });
      }
      res.status(500).json({ error: error.message });
    }
  }

  async deleteDetail(req, res) {
    try {
      const result = await meetingRoomDetailService.deleteDetail(req.params.id);
      res.json(result);
    } catch (error) {
      if (error.message === "Detail not found") {
        return res.status(404).json({ error: error.message });
      }
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new MeetingRoomDetailController();