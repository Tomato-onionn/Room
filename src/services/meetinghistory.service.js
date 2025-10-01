const meetingHistoryRepository = require("../repositories/meetinghistory.repository");
const meetingRoomRepository = require("../repositories/meetingroom.repository");

class MeetingHistoryService {
  async getAllHistory(filters = {}) {
    try {
      const { room_id, mentor_id, user_id, limit = 50 } = filters;
      let whereClause = {};
      
      if (room_id) whereClause.room_id = room_id;
      if (mentor_id) whereClause.mentor_id = mentor_id;
      if (user_id) whereClause.user_id = user_id;

      return await meetingHistoryRepository.findAll(whereClause, limit);
    } catch (error) {
      throw new Error(`Error getting meeting history: ${error.message}`);
    }
  }

  async getHistoryById(id) {
    try {
      const history = await meetingHistoryRepository.findById(id);
      if (!history) {
        throw new Error("History not found");
      }
      return history;
    } catch (error) {
      throw error;
    }
  }

  async getHistoryByRoomId(roomId, limit = 10) {
    try {
      return await meetingHistoryRepository.findByRoomId(roomId, limit);
    } catch (error) {
      throw new Error(`Error getting history by room: ${error.message}`);
    }
  }

  async getHistoryByUserId(userId, limit = 20) {
    try {
      return await meetingHistoryRepository.findByUserId(userId, limit);
    } catch (error) {
      throw new Error(`Error getting history by user: ${error.message}`);
    }
  }

  async getHistoryByMentorId(mentorId, limit = 20) {
    try {
      return await meetingHistoryRepository.findByMentorId(mentorId, limit);
    } catch (error) {
      throw new Error(`Error getting history by mentor: ${error.message}`);
    }
  }

  async createHistory(data) {
    try {
      // Validate required fields
      const { room_id, mentor_id, user_id } = data;
      if (!room_id || !mentor_id || !user_id) {
        throw new Error("Missing required fields: room_id, mentor_id, user_id");
      }

      // Check if room exists
      const room = await meetingRoomRepository.findById(room_id);
      if (!room) {
        throw new Error("Room not found");
      }

      return await meetingHistoryRepository.create(data);
    } catch (error) {
      throw error;
    }
  }

  async updateHistory(id, data) {
    try {
      const updatedHistory = await meetingHistoryRepository.update(id, data);
      if (!updatedHistory) {
        throw new Error("History not found");
      }
      return updatedHistory;
    } catch (error) {
      throw error;
    }
  }

  async deleteHistory(id) {
    try {
      const deleted = await meetingHistoryRepository.delete(id);
      if (!deleted) {
        throw new Error("History not found");
      }
      return { message: "History deleted successfully" };
    } catch (error) {
      throw error;
    }
  }

  async getDurationStats(filters = {}) {
    try {
      const { mentor_id, user_id } = filters;
      let whereClause = {};
      
      if (mentor_id) whereClause.mentor_id = mentor_id;
      if (user_id) whereClause.user_id = user_id;

      return await meetingHistoryRepository.getStats(whereClause);
    } catch (error) {
      throw new Error(`Error getting duration stats: ${error.message}`);
    }
  }
}

module.exports = new MeetingHistoryService();