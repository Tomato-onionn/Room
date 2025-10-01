const express = require("express");
const router = express.Router();
const db = require("../models");

/**
 * @swagger
 * components:
 *   schemas:
 *     MeetingHistory:
 *       type: object
 *       required:
 *         - room_id
 *         - mentor_id
 *         - user_id
 *       properties:
 *         id:
 *           type: integer
 *           description: ID lịch sử meeting
 *         room_id:
 *           type: integer
 *           description: ID phòng họp
 *         mentor_id:
 *           type: integer
 *           description: ID mentor
 *         user_id:
 *           type: integer
 *           description: ID user
 *         duration_minutes:
 *           type: integer
 *           description: Thời lượng meeting (phút)
 *         completed_at:
 *           type: string
 *           format: date-time
 *           description: Thời gian hoàn thành
 */

/**
 * @swagger
 * tags:
 *   name: MeetingHistory
 *   description: API quản lý lịch sử meeting
 */

/**
 * @swagger
 * /meeting-history:
 *   get:
 *     summary: Lấy danh sách lịch sử meeting
 *     tags: [MeetingHistory]
 *     parameters:
 *       - in: query
 *         name: room_id
 *         schema:
 *           type: integer
 *         description: Lọc theo room ID
 *       - in: query
 *         name: mentor_id
 *         schema:
 *           type: integer
 *         description: Lọc theo mentor ID
 *       - in: query
 *         name: user_id
 *         schema:
 *           type: integer
 *         description: Lọc theo user ID
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 50
 *         description: Giới hạn số lượng kết quả
 *     responses:
 *       200:
 *         description: Danh sách lịch sử meeting
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/MeetingHistory'
 *       500:
 *         description: Lỗi server
 */
router.get("/", async (req, res) => {
  try {
    const { room_id, mentor_id, user_id, limit = 50 } = req.query;
    let whereClause = {};
    
    if (room_id) whereClause.room_id = room_id;
    if (mentor_id) whereClause.mentor_id = mentor_id;
    if (user_id) whereClause.user_id = user_id;

    const history = await db.MeetingHistory.findAll({
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
    res.json(history);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /meeting-history/{id}:
 *   get:
 *     summary: Lấy chi tiết lịch sử meeting theo ID
 *     tags: [MeetingHistory]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID của lịch sử meeting
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Chi tiết lịch sử meeting
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MeetingHistory'
 *       404:
 *         description: Không tìm thấy lịch sử
 *       500:
 *         description: Lỗi server
 */
router.get("/:id", async (req, res) => {
  try {
    const history = await db.MeetingHistory.findByPk(req.params.id, {
      include: [
        {
          model: db.MeetingRoom,
          as: 'room',
          required: false
        }
      ]
    });
    if (!history) return res.status(404).json({ error: "History not found" });
    res.json(history);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /meeting-history/room/{roomId}:
 *   get:
 *     summary: Lấy lịch sử meeting theo room ID
 *     tags: [MeetingHistory]
 *     parameters:
 *       - in: path
 *         name: roomId
 *         required: true
 *         description: ID của phòng họp
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Giới hạn số lượng kết quả
 *     responses:
 *       200:
 *         description: Lịch sử meeting của phòng
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/MeetingHistory'
 *       500:
 *         description: Lỗi server
 */
router.get("/room/:roomId", async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    const history = await db.MeetingHistory.findAll({
      where: { room_id: req.params.roomId },
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
    res.json(history);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /meeting-history/user/{userId}:
 *   get:
 *     summary: Lấy lịch sử meeting theo user ID
 *     tags: [MeetingHistory]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         description: ID của user
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *         description: Giới hạn số lượng kết quả
 *     responses:
 *       200:
 *         description: Lịch sử meeting của user
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/MeetingHistory'
 *       500:
 *         description: Lỗi server
 */
router.get("/user/:userId", async (req, res) => {
  try {
    const { limit = 20 } = req.query;
    const history = await db.MeetingHistory.findAll({
      where: { user_id: req.params.userId },
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
    res.json(history);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /meeting-history/mentor/{mentorId}:
 *   get:
 *     summary: Lấy lịch sử meeting theo mentor ID
 *     tags: [MeetingHistory]
 *     parameters:
 *       - in: path
 *         name: mentorId
 *         required: true
 *         description: ID của mentor
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *         description: Giới hạn số lượng kết quả
 *     responses:
 *       200:
 *         description: Lịch sử meeting của mentor
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/MeetingHistory'
 *       500:
 *         description: Lỗi server
 */
router.get("/mentor/:mentorId", async (req, res) => {
  try {
    const { limit = 20 } = req.query;
    const history = await db.MeetingHistory.findAll({
      where: { mentor_id: req.params.mentorId },
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
    res.json(history);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /meeting-history:
 *   post:
 *     summary: Tạo lịch sử meeting mới
 *     tags: [MeetingHistory]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - room_id
 *               - mentor_id
 *               - user_id
 *             properties:
 *               room_id:
 *                 type: integer
 *                 description: ID phòng họp
 *               mentor_id:
 *                 type: integer
 *                 description: ID mentor
 *               user_id:
 *                 type: integer
 *                 description: ID user
 *               duration_minutes:
 *                 type: integer
 *                 description: Thời lượng meeting (phút)
 *     responses:
 *       201:
 *         description: Tạo lịch sử thành công
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MeetingHistory'
 *       400:
 *         description: Dữ liệu không hợp lệ
 *       500:
 *         description: Lỗi server
 */
router.post("/", async (req, res) => {
  try {
    const { room_id, mentor_id, user_id, duration_minutes } = req.body;
    
    // Kiểm tra room có tồn tại không
    const room = await db.MeetingRoom.findByPk(room_id);
    if (!room) return res.status(400).json({ error: "Room not found" });
    
    const newHistory = await db.MeetingHistory.create({
      room_id,
      mentor_id,
      user_id,
      duration_minutes
    });
    
    res.status(201).json(newHistory);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /meeting-history/{id}:
 *   put:
 *     summary: Cập nhật lịch sử meeting
 *     tags: [MeetingHistory]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               duration_minutes:
 *                 type: integer
 *                 description: Thời lượng meeting (phút)
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 *       404:
 *         description: Không tìm thấy lịch sử
 *       500:
 *         description: Lỗi server
 */
router.put("/:id", async (req, res) => {
  try {
    const history = await db.MeetingHistory.findByPk(req.params.id);
    if (!history) return res.status(404).json({ error: "History not found" });
    
    await history.update(req.body);
    res.json(history);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /meeting-history/{id}:
 *   delete:
 *     summary: Xóa lịch sử meeting
 *     tags: [MeetingHistory]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Xóa thành công
 *       404:
 *         description: Không tìm thấy lịch sử
 *       500:
 *         description: Lỗi server
 */
router.delete("/:id", async (req, res) => {
  try {
    const history = await db.MeetingHistory.findByPk(req.params.id);
    if (!history) return res.status(404).json({ error: "History not found" });
    
    await history.destroy();
    res.json({ message: "History deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /meeting-history/stats/duration:
 *   get:
 *     summary: Thống kê thời lượng meeting
 *     tags: [MeetingHistory]
 *     parameters:
 *       - in: query
 *         name: mentor_id
 *         schema:
 *           type: integer
 *         description: Lọc theo mentor ID
 *       - in: query
 *         name: user_id
 *         schema:
 *           type: integer
 *         description: Lọc theo user ID
 *     responses:
 *       200:
 *         description: Thống kê thời lượng
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total_meetings:
 *                   type: integer
 *                   description: Tổng số meeting
 *                 total_duration_minutes:
 *                   type: integer
 *                   description: Tổng thời lượng (phút)
 *                 average_duration_minutes:
 *                   type: number
 *                   description: Thời lượng trung bình (phút)
 *       500:
 *         description: Lỗi server
 */
router.get("/stats/duration", async (req, res) => {
  try {
    const { mentor_id, user_id } = req.query;
    let whereClause = {};
    
    if (mentor_id) whereClause.mentor_id = mentor_id;
    if (user_id) whereClause.user_id = user_id;

    const stats = await db.MeetingHistory.findAll({
      where: whereClause,
      attributes: [
        [db.sequelize.fn('COUNT', db.sequelize.col('id')), 'total_meetings'],
        [db.sequelize.fn('SUM', db.sequelize.col('duration_minutes')), 'total_duration_minutes'],
        [db.sequelize.fn('AVG', db.sequelize.col('duration_minutes')), 'average_duration_minutes']
      ],
      raw: true
    });
    
    res.json(stats[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;