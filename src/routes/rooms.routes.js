const express = require("express");
const router = express.Router();
const db = require("../models");

/**
 * @swagger
 * components:
 *   schemas:
 *     MeetingRoom:
 *       type: object
 *       required:
 *         - id
 *         - room_name
 *         - mentor_id
 *         - user_id
 *         - start_time
 *       properties:
 *         id:
 *           type: integer
 *           description: ID của phòng họp
 *         room_name:
 *           type: string
 *           description: Tên phòng họp
 *         mentor_id:
 *           type: integer
 *           description: ID của mentor
 *         user_id:
 *           type: integer
 *           description: ID của user
 *         start_time:
 *           type: string
 *           format: date-time
 *           description: Thời gian bắt đầu
 *         end_time:
 *           type: string
 *           format: date-time
 *           description: Thời gian kết thúc
 *         status:
 *           type: string
 *           enum: [scheduled, ongoing, completed, canceled]
 *           description: Trạng thái phòng họp
 *     MeetingRoomDetail:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: ID chi tiết phòng họp
 *         room_id:
 *           type: integer
 *           description: ID phòng họp
 *         meeting_link:
 *           type: string
 *           description: Link tham gia meeting
 *         meeting_password:
 *           type: string
 *           description: Mật khẩu meeting
 *         notes:
 *           type: string
 *           description: Ghi chú
 *         recorded_url:
 *           type: string
 *           description: URL recording
 *     MeetingHistory:
 *       type: object
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
 *     Error:
 *       type: object
 *       properties:
 *         error:
 *           type: string
 *           description: Thông báo lỗi
 */

/**
 * @swagger
 * tags:
 *   name: MeetingRoom
 *   description: API quản lý phòng họp meeting
 */

/**
 * @swagger
 * /rooms:
 *   get:
 *     summary: Lấy danh sách tất cả Meeting Rooms
 *     tags: [MeetingRoom]
 *     responses:
 *       200:
 *         description: Danh sách Meeting Rooms thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/MeetingRoom'
 *       500:
 *         description: Lỗi server
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/", async (req, res) => {
  try {
    const rooms = await db.MeetingRoom.findAll({
      include: [
        {
          model: db.MeetingRoomDetail,
          as: 'details',
          required: false
        }
      ],
      order: [['start_time', 'DESC']]
    });
    res.json(rooms);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /rooms/{id}:
 *   get:
 *     summary: Lấy thông tin chi tiết một Meeting Room
 *     tags: [MeetingRoom]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID của phòng họp
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Meeting Room chi tiết
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MeetingRoom'
 *       404:
 *         description: Không tìm thấy phòng
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Lỗi server
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/:id", async (req, res) => {
  try {
    const room = await db.MeetingRoom.findByPk(req.params.id, {
      include: [
        {
          model: db.MeetingRoomDetail,
          as: 'details',
          required: false
        },
        {
          model: db.MeetingHistory,
          as: 'history',
          required: false,
          order: [['completed_at', 'DESC']]
        }
      ]
    });
    if (!room) return res.status(404).json({ error: "Room not found" });
    res.json(room);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /rooms/{id}/details:
 *   get:
 *     summary: Lấy chi tiết meeting room (bao gồm link, password, notes)
 *     tags: [MeetingRoom]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID của phòng họp
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Chi tiết meeting room
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 room:
 *                   $ref: '#/components/schemas/MeetingRoom'
 *                 details:
 *                   $ref: '#/components/schemas/MeetingRoomDetail'
 *       404:
 *         description: Không tìm thấy phòng
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Lỗi server
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/:id/details", async (req, res) => {
  try {
    const room = await db.MeetingRoom.findByPk(req.params.id);
    if (!room) return res.status(404).json({ error: "Room not found" });
    
    const details = await db.MeetingRoomDetail.findOne({
      where: { room_id: req.params.id }
    });
    
    res.json({
      room: room,
      details: details
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /rooms/{id}/history:
 *   get:
 *     summary: Lấy lịch sử meeting của phòng
 *     tags: [MeetingRoom]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID của phòng họp
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Lịch sử meeting của phòng
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/MeetingHistory'
 *       404:
 *         description: Không tìm thấy phòng
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Lỗi server
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/:id/history", async (req, res) => {
  try {
    const room = await db.MeetingRoom.findByPk(req.params.id);
    if (!room) return res.status(404).json({ error: "Room not found" });
    
    const history = await db.MeetingHistory.findAll({
      where: { room_id: req.params.id },
      order: [['completed_at', 'DESC']]
    });
    
    res.json(history);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /rooms/user/{userId}:
 *   get:
 *     summary: Lấy danh sách meeting rooms của một user
 *     tags: [MeetingRoom]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         description: ID của user
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Danh sách meeting rooms của user
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/MeetingRoom'
 *       500:
 *         description: Lỗi server
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/user/:userId", async (req, res) => {
  try {
    const rooms = await db.MeetingRoom.findAll({
      where: { user_id: req.params.userId },
      order: [['start_time', 'DESC']]
    });
    res.json(rooms);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /rooms/mentor/{mentorId}:
 *   get:
 *     summary: Lấy danh sách meeting rooms của một mentor
 *     tags: [MeetingRoom]
 *     parameters:
 *       - in: path
 *         name: mentorId
 *         required: true
 *         description: ID của mentor
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Danh sách meeting rooms của mentor
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/MeetingRoom'
 *       500:
 *         description: Lỗi server
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/mentor/:mentorId", async (req, res) => {
  try {
    const rooms = await db.MeetingRoom.findAll({
      where: { mentor_id: req.params.mentorId },
      order: [['start_time', 'DESC']]
    });
    res.json(rooms);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /rooms/status/{status}:
 *   get:
 *     summary: Lấy danh sách meeting rooms theo trạng thái
 *     tags: [MeetingRoom]
 *     parameters:
 *       - in: path
 *         name: status
 *         required: true
 *         description: Trạng thái phòng họp
 *         schema:
 *           type: string
 *           enum: [scheduled, ongoing, completed, canceled]
 *     responses:
 *       200:
 *         description: Danh sách meeting rooms theo trạng thái
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/MeetingRoom'
 *       500:
 *         description: Lỗi server
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/status/:status", async (req, res) => {
  try {
    const validStatuses = ['scheduled', 'ongoing', 'completed', 'canceled'];
    if (!validStatuses.includes(req.params.status)) {
      return res.status(400).json({ error: "Invalid status. Must be one of: " + validStatuses.join(', ') });
    }
    
    const rooms = await db.MeetingRoom.findAll({
      where: { status: req.params.status },
      order: [['start_time', 'DESC']]
    });
    res.json(rooms);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
