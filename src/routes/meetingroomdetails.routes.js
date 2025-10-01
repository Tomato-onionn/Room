const express = require("express");
const router = express.Router();
const db = require("../models");

/**
 * @swagger
 * components:
 *   schemas:
 *     MeetingRoomDetail:
 *       type: object
 *       required:
 *         - room_id
 *         - meeting_link
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
 */

/**
 * @swagger
 * tags:
 *   name: MeetingRoomDetails
 *   description: API quản lý chi tiết phòng họp (link, password, notes, recording)
 */

/**
 * @swagger
 * /room-details:
 *   get:
 *     summary: Lấy danh sách tất cả chi tiết phòng họp
 *     tags: [MeetingRoomDetails]
 *     parameters:
 *       - in: query
 *         name: room_id
 *         schema:
 *           type: integer
 *         description: Lọc theo room ID
 *     responses:
 *       200:
 *         description: Danh sách chi tiết phòng họp
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/MeetingRoomDetail'
 *       500:
 *         description: Lỗi server
 */
router.get("/", async (req, res) => {
  try {
    const { room_id } = req.query;
    let whereClause = {};
    
    if (room_id) whereClause.room_id = room_id;

    const details = await db.MeetingRoomDetail.findAll({
      where: whereClause,
      include: [
        {
          model: db.MeetingRoom,
          as: 'room',
          required: false
        }
      ]
    });
    res.json(details);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /room-details/{id}:
 *   get:
 *     summary: Lấy chi tiết phòng họp theo ID
 *     tags: [MeetingRoomDetails]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID của chi tiết phòng họp
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Chi tiết phòng họp
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MeetingRoomDetail'
 *       404:
 *         description: Không tìm thấy chi tiết
 *       500:
 *         description: Lỗi server
 */
router.get("/:id", async (req, res) => {
  try {
    const detail = await db.MeetingRoomDetail.findByPk(req.params.id, {
      include: [
        {
          model: db.MeetingRoom,
          as: 'room',
          required: false
        }
      ]
    });
    if (!detail) return res.status(404).json({ error: "Detail not found" });
    res.json(detail);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /room-details/room/{roomId}:
 *   get:
 *     summary: Lấy chi tiết theo room ID
 *     tags: [MeetingRoomDetails]
 *     parameters:
 *       - in: path
 *         name: roomId
 *         required: true
 *         description: ID của phòng họp
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Chi tiết phòng họp
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MeetingRoomDetail'
 *       404:
 *         description: Không tìm thấy chi tiết
 *       500:
 *         description: Lỗi server
 */
router.get("/room/:roomId", async (req, res) => {
  try {
    const detail = await db.MeetingRoomDetail.findOne({
      where: { room_id: req.params.roomId },
      include: [
        {
          model: db.MeetingRoom,
          as: 'room',
          required: false
        }
      ]
    });
    if (!detail) return res.status(404).json({ error: "Detail not found for this room" });
    res.json(detail);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /room-details:
 *   post:
 *     summary: Tạo chi tiết phòng họp mới
 *     tags: [MeetingRoomDetails]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - room_id
 *               - meeting_link
 *             properties:
 *               room_id:
 *                 type: integer
 *                 description: ID phòng họp
 *               meeting_link:
 *                 type: string
 *                 description: Link meeting
 *               meeting_password:
 *                 type: string
 *                 description: Mật khẩu meeting
 *               notes:
 *                 type: string
 *                 description: Ghi chú
 *               recorded_url:
 *                 type: string
 *                 description: URL recording
 *     responses:
 *       201:
 *         description: Tạo chi tiết thành công
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MeetingRoomDetail'
 *       400:
 *         description: Dữ liệu không hợp lệ
 *       500:
 *         description: Lỗi server
 */
router.post("/", async (req, res) => {
  try {
    const { room_id, meeting_link, meeting_password, notes, recorded_url } = req.body;
    
    // Kiểm tra room có tồn tại không
    const room = await db.MeetingRoom.findByPk(room_id);
    if (!room) return res.status(400).json({ error: "Room not found" });
    
    const newDetail = await db.MeetingRoomDetail.create({
      room_id,
      meeting_link,
      meeting_password,
      notes,
      recorded_url
    });
    
    res.status(201).json(newDetail);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /room-details/{id}:
 *   put:
 *     summary: Cập nhật chi tiết phòng họp
 *     tags: [MeetingRoomDetails]
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
 *               meeting_link:
 *                 type: string
 *               meeting_password:
 *                 type: string
 *               notes:
 *                 type: string
 *               recorded_url:
 *                 type: string
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 *       404:
 *         description: Không tìm thấy chi tiết
 *       500:
 *         description: Lỗi server
 */
router.put("/:id", async (req, res) => {
  try {
    const detail = await db.MeetingRoomDetail.findByPk(req.params.id);
    if (!detail) return res.status(404).json({ error: "Detail not found" });
    
    await detail.update(req.body);
    res.json(detail);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /room-details/{id}:
 *   delete:
 *     summary: Xóa chi tiết phòng họp
 *     tags: [MeetingRoomDetails]
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
 *         description: Không tìm thấy chi tiết
 *       500:
 *         description: Lỗi server
 */
router.delete("/:id", async (req, res) => {
  try {
    const detail = await db.MeetingRoomDetail.findByPk(req.params.id);
    if (!detail) return res.status(404).json({ error: "Detail not found" });
    
    await detail.destroy();
    res.json({ message: "Detail deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;