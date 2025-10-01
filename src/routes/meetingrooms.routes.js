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
 */

/**
 * @swagger
 * tags:
 *   name: MeetingRooms
 *   description: API quản lý phòng họp meeting
 */

/**
 * @swagger
 * /meetingrooms:
 *   get:
 *     summary: Lấy danh sách tất cả Meeting Rooms
 *     tags: [MeetingRooms]
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [scheduled, ongoing, completed, canceled]
 *         description: Lọc theo trạng thái
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
 *         description: Danh sách Meeting Rooms thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/MeetingRoom'
 *       500:
 *         description: Lỗi server
 */
router.get("/", async (req, res) => {
  try {
    const { status, mentor_id, user_id } = req.query;
    let whereClause = {};
    
    if (status) whereClause.status = status;
    if (mentor_id) whereClause.mentor_id = mentor_id;
    if (user_id) whereClause.user_id = user_id;

    const rooms = await db.MeetingRoom.findAll({
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
    res.json(rooms);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /meetingrooms/{id}:
 *   get:
 *     summary: Lấy thông tin chi tiết một Meeting Room
 *     tags: [MeetingRooms]
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
 *       500:
 *         description: Lỗi server
 */
router.get("/:id", async (req, res) => {
  try {
    const room = await db.MeetingRoom.findByPk(req.params.id, {
      include: [
        {
          model: db.MeetingRoomDetail,
          as: 'details',
          required: false
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
 * /meetingrooms:
 *   post:
 *     summary: Tạo phòng họp mới
 *     tags: [MeetingRooms]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - room_name
 *               - mentor_id
 *               - user_id
 *               - start_time
 *             properties:
 *               room_name:
 *                 type: string
 *                 description: Tên phòng họp
 *               mentor_id:
 *                 type: integer
 *                 description: ID mentor
 *               user_id:
 *                 type: integer
 *                 description: ID user
 *               start_time:
 *                 type: string
 *                 format: date-time
 *                 description: Thời gian bắt đầu
 *               end_time:
 *                 type: string
 *                 format: date-time
 *                 description: Thời gian kết thúc
 *               status:
 *                 type: string
 *                 enum: [scheduled, ongoing, completed, canceled]
 *                 description: Trạng thái
 *     responses:
 *       201:
 *         description: Tạo phòng thành công
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MeetingRoom'
 *       400:
 *         description: Dữ liệu không hợp lệ
 *       500:
 *         description: Lỗi server
 */
router.post("/", async (req, res) => {
  try {
    const { room_name, mentor_id, user_id, start_time, end_time, status } = req.body;
    
    const newRoom = await db.MeetingRoom.create({
      room_name,
      mentor_id,
      user_id,
      start_time,
      end_time,
      status: status || 'scheduled'
    });
    
    res.status(201).json(newRoom);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /meetingrooms/{id}:
 *   put:
 *     summary: Cập nhật thông tin phòng họp
 *     tags: [MeetingRooms]
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
 *               room_name:
 *                 type: string
 *               start_time:
 *                 type: string
 *                 format: date-time
 *               end_time:
 *                 type: string
 *                 format: date-time
 *               status:
 *                 type: string
 *                 enum: [scheduled, ongoing, completed, canceled]
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 *       404:
 *         description: Không tìm thấy phòng
 *       500:
 *         description: Lỗi server
 */
router.put("/:id", async (req, res) => {
  try {
    const room = await db.MeetingRoom.findByPk(req.params.id);
    if (!room) return res.status(404).json({ error: "Room not found" });
    
    await room.update(req.body);
    res.json(room);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /meetingrooms/{id}:
 *   delete:
 *     summary: Xóa phòng họp
 *     tags: [MeetingRooms]
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
 *         description: Không tìm thấy phòng
 *       500:
 *         description: Lỗi server
 */
router.delete("/:id", async (req, res) => {
  try {
    const room = await db.MeetingRoom.findByPk(req.params.id);
    if (!room) return res.status(404).json({ error: "Room not found" });
    
    await room.destroy();
    res.json({ message: "Room deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;