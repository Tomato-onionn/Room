const db = require("../models");

class MeetingHistoryRepository {
  async findAll(whereClause = {}, limit = 50) {
    return await db.MeetingHistory.findAll({
      where: whereClause,
      include: [
        {
          model: db.MeetingRoom,
          as: 'room',
          required: false
        }
      ],
      order: [['completed_at', 'DESC']],
      limit: parseInt(limit)
    });
  }

  async findById(id) {
    return await db.MeetingHistory.findByPk(id, {
      include: [
        {
          model: db.MeetingRoom,
          as: 'room',
          required: false
        }
      ]
    });
  }

  async findByRoomId(roomId, limit = 10) {
    return await this.findAll({ room_id: roomId }, limit);
  }

  async findByUserId(userId, limit = 20) {
    return await this.findAll({ user_id: userId }, limit);
  }

  async findByMentorId(mentorId, limit = 20) {
    return await this.findAll({ mentor_id: mentorId }, limit);
  }

  async create(data) {
    return await db.MeetingHistory.create(data);
  }

  async update(id, data) {
    const history = await this.findById(id);
    if (!history) return null;
    
    await history.update(data);
    return history;
  }

  async delete(id) {
    const history = await this.findById(id);
    if (!history) return false;
    
    await history.destroy();
    return true;
  }

  async getStats(whereClause = {}) {
    const stats = await db.MeetingHistory.findAll({
      where: whereClause,
      attributes: [
        [db.sequelize.fn('COUNT', db.sequelize.col('id')), 'total_meetings'],
        [db.sequelize.fn('SUM', db.sequelize.col('duration_minutes')), 'total_duration_minutes'],
        [db.sequelize.fn('AVG', db.sequelize.col('duration_minutes')), 'average_duration_minutes']
      ],
      raw: true
    });
    
    return stats[0];
  }
}

module.exports = new MeetingHistoryRepository();