const express = require("express");
const router = express.Router();
const meetingRoomDetailController = require("../controllers/meetingroomdetail.controller");

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
router.get("/", meetingRoomDetailController.getAllDetails);

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
router.get("/:id", meetingRoomDetailController.getDetailById);

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
router.get("/room/:roomId", meetingRoomDetailController.getDetailByRoomId);

router.post("/", meetingRoomDetailController.createDetail);
router.put("/:id", meetingRoomDetailController.updateDetail);
router.delete("/:id", meetingRoomDetailController.deleteDetail);

module.exports = router;