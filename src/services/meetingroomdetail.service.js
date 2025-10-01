const meetingRoomDetailRepository = require("../repositories/meetingroomdetail.repository");
const meetingRoomRepository = require("../repositories/meetingroom.repository");

class MeetingRoomDetailService {
  async getAllDetails(filters = {}) {
    try {
      const { room_id } = filters;
      let whereClause = {};
      
      if (room_id) whereClause.room_id = room_id;

      return await meetingRoomDetailRepository.findAll(whereClause);
    } catch (error) {
      throw new Error(`Error getting room details: ${error.message}`);
    }
  }

  async getDetailById(id) {
    try {
      const detail = await meetingRoomDetailRepository.findById(id);
      if (!detail) {
        throw new Error("Detail not found");
      }
      return detail;
    } catch (error) {
      throw error;
    }
  }

  async getDetailByRoomId(roomId) {
    try {
      const detail = await meetingRoomDetailRepository.findByRoomId(roomId);
      if (!detail) {
        throw new Error("Detail not found for this room");
      }
      return detail;
    } catch (error) {
      throw error;
    }
  }

  async createDetail(data) {
    try {
      // Validate required fields
      const { room_id, meeting_link } = data;
      if (!room_id || !meeting_link) {
        throw new Error("Missing required fields: room_id, meeting_link");
      }

      // Check if room exists
      const room = await meetingRoomRepository.findById(room_id);
      if (!room) {
        throw new Error("Room not found");
      }

      return await meetingRoomDetailRepository.create(data);
    } catch (error) {
      throw error;
    }
  }

  async updateDetail(id, data) {
    try {
      const updatedDetail = await meetingRoomDetailRepository.update(id, data);
      if (!updatedDetail) {
        throw new Error("Detail not found");
      }
      return updatedDetail;
    } catch (error) {
      throw error;
    }
  }

  async deleteDetail(id) {
    try {
      const deleted = await meetingRoomDetailRepository.delete(id);
      if (!deleted) {
        throw new Error("Detail not found");
      }
      return { message: "Detail deleted successfully" };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new MeetingRoomDetailService();