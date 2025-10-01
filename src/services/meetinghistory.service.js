const meetingHistoryRepository = require("../repositories/meetinghistory.repository");
const meetingRoomRepository = require("../repositories/meetingroom.repository");

class MeetingHistoryService {
  async getAllHistory(filters = {}) {
    try {
      const { room_id, mentor_id, user_id } = filters;
      let whereClause = {};
      
      if (room_id) whereClause.room_id = room_id;
      if (mentor_id) whereClause.mentor_id = mentor_id;
      if (user_id) whereClause.user_id = user_id;

      return await meetingHistoryRepository.findAll(whereClause);
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

  async getHistoryByRoomId(roomId) {
    try {
      return await meetingHistoryRepository.findByRoomId(roomId);
    } catch (error) {
      throw new Error(`Error getting history by room: ${error.message}`);
    }
  }

  async getHistoryByUserId(userId) {
    try {
      return await meetingHistoryRepository.findByUserId(userId);
    } catch (error) {
      throw new Error(`Error getting history by user: ${error.message}`);
    }
  }

  async getHistoryByMentorId(mentorId) {
    try {
      return await meetingHistoryRepository.findByMentorId(mentorId);
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