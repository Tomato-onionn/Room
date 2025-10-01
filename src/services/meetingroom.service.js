const meetingRoomRepository = require("../repositories/meetingroom.repository");

class MeetingRoomService {
  async getAllRooms(filters = {}) {
    try {
      const { status, mentor_id, user_id } = filters;
      let whereClause = {};
      
      if (status) whereClause.status = status;
      if (mentor_id) whereClause.mentor_id = mentor_id;
      if (user_id) whereClause.user_id = user_id;

      return await meetingRoomRepository.findAll(whereClause);
    } catch (error) {
      throw new Error(`Error getting rooms: ${error.message}`);
    }
  }

  async getRoomById(id) {
    try {
      const room = await meetingRoomRepository.findById(id);
      if (!room) {
        throw new Error("Room not found");
      }
      return room;
    } catch (error) {
      throw error;
    }
  }

  async createRoom(data) {
    try {
      // Validate required fields
      const { room_name, mentor_id, user_id, start_time } = data;
      if (!room_name || !mentor_id || !user_id || !start_time) {
        throw new Error("Missing required fields: room_name, mentor_id, user_id, start_time");
      }

      const roomData = {
        ...data,
        status: data.status || 'scheduled'
      };

      return await meetingRoomRepository.create(roomData);
    } catch (error) {
      throw new Error(`Error creating room: ${error.message}`);
    }
  }

  async updateRoom(id, data) {
    try {
      const updatedRoom = await meetingRoomRepository.update(id, data);
      if (!updatedRoom) {
        throw new Error("Room not found");
      }
      return updatedRoom;
    } catch (error) {
      throw error;
    }
  }

  async deleteRoom(id) {
    try {
      const deleted = await meetingRoomRepository.delete(id);
      if (!deleted) {
        throw new Error("Room not found");
      }
      return { message: "Room deleted successfully" };
    } catch (error) {
      throw error;
    }
  }

  async getRoomsByUserId(userId) {
    try {
      return await meetingRoomRepository.findByUserId(userId);
    } catch (error) {
      throw new Error(`Error getting rooms by user: ${error.message}`);
    }
  }

  async getRoomsByMentorId(mentorId) {
    try {
      return await meetingRoomRepository.findByMentorId(mentorId);
    } catch (error) {
      throw new Error(`Error getting rooms by mentor: ${error.message}`);
    }
  }

  async getRoomsByStatus(status) {
    try {
      const validStatuses = ['scheduled', 'ongoing', 'completed', 'canceled'];
      if (!validStatuses.includes(status)) {
        throw new Error(`Invalid status. Must be one of: ${validStatuses.join(', ')}`);
      }
      
      return await meetingRoomRepository.findByStatus(status);
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new MeetingRoomService();