const db = require("../models");

class MeetingRoomDetailRepository {
  async findAll(whereClause = {}) {
    return await db.MeetingRoomDetail.findAll({
      where: whereClause,
      include: [
        {
          model: db.MeetingRoom,
          as: 'room',
          required: false
        }
      ]
    });
  }

  async findById(id) {
    return await db.MeetingRoomDetail.findByPk(id, {
      include: [
        {
          model: db.MeetingRoom,
          as: 'room',
          required: false
        }
      ]
    });
  }

  async findByRoomId(roomId) {
    return await db.MeetingRoomDetail.findOne({
      where: { room_id: roomId },
      include: [
        {
          model: db.MeetingRoom,
          as: 'room',
          required: false
        }
      ]
    });
  }

  async create(data) {
    return await db.MeetingRoomDetail.create(data);
  }

  async update(id, data) {
    const detail = await this.findById(id);
    if (!detail) return null;
    
    await detail.update(data);
    return detail;
  }

  async delete(id) {
    const detail = await this.findById(id);
    if (!detail) return false;
    
    await detail.destroy();
    return true;
  }
}

module.exports = new MeetingRoomDetailRepository();