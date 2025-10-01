const meetingHistoryService = require("../services/meetinghistory.service");

class MeetingHistoryController {
  async getAllHistory(req, res) {
    try {
      const history = await meetingHistoryService.getAllHistory(req.query);
      res.json(history);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getHistoryById(req, res) {
    try {
      const history = await meetingHistoryService.getHistoryById(req.params.id);
      res.json(history);
    } catch (error) {
      if (error.message === "History not found") {
        return res.status(404).json({ error: error.message });
      }
      res.status(500).json({ error: error.message });
    }
  }

  async getHistoryByRoomId(req, res) {
    try {
      const { limit } = req.query;
      const history = await meetingHistoryService.getHistoryByRoomId(req.params.roomId, limit);
      res.json(history);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getHistoryByUserId(req, res) {
    try {
      const { limit } = req.query;
      const history = await meetingHistoryService.getHistoryByUserId(req.params.userId, limit);
      res.json(history);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getHistoryByMentorId(req, res) {
    try {
      const { limit } = req.query;
      const history = await meetingHistoryService.getHistoryByMentorId(req.params.mentorId, limit);
      res.json(history);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async createHistory(req, res) {
    try {
      const newHistory = await meetingHistoryService.createHistory(req.body);
      res.status(201).json(newHistory);
    } catch (error) {
      if (error.message.includes("Missing required fields") || error.message === "Room not found") {
        return res.status(400).json({ error: error.message });
      }
      res.status(500).json({ error: error.message });
    }
  }

  async updateHistory(req, res) {
    try {
      const updatedHistory = await meetingHistoryService.updateHistory(req.params.id, req.body);
      res.json(updatedHistory);
    } catch (error) {
      if (error.message === "History not found") {
        return res.status(404).json({ error: error.message });
      }
      res.status(500).json({ error: error.message });
    }
  }

  async deleteHistory(req, res) {
    try {
      const result = await meetingHistoryService.deleteHistory(req.params.id);
      res.json(result);
    } catch (error) {
      if (error.message === "History not found") {
        return res.status(404).json({ error: error.message });
      }
      res.status(500).json({ error: error.message });
    }
  }

  async getDurationStats(req, res) {
    try {
      const stats = await meetingHistoryService.getDurationStats(req.query);
      res.json(stats);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new MeetingHistoryController();