const db = require("../models");

class MeetingRoomRepository {
  async findAll(whereClause = {}) {
    return await db.MeetingRoom.findAll({
      where: whereClause,
      include: [
        {
          model: db.MeetingRoomDetail,
          as: 'details',
          required: false
        }
      ],
      order: [['start_time', 'DESC']]
    });
  }

  async findById(id) {
    return await db.MeetingRoom.findByPk(id, {
      include: [
        {
          model: db.MeetingRoomDetail,
          as: 'details',
          required: false
        }
      ]
    });
  }

  async create(data) {
    return await db.MeetingRoom.create(data);
  }

  async update(id, data) {
    const room = await this.findById(id);
    if (!room) return null;
    
    await room.update(data);
    return room;
  }

  async delete(id) {
    const room = await this.findById(id);
    if (!room) return false;
    
    await room.destroy();
    return true;
  }

  async findByUserId(userId) {
    return await this.findAll({ user_id: userId });
  }

  async findByMentorId(mentorId) {
    return await this.findAll({ mentor_id: mentorId });
  }

  async findByStatus(status) {
    return await this.findAll({ status });
  }
}

module.exports = new MeetingRoomRepository();