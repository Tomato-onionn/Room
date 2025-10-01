const express = require("express");
const router = express.Router();
const meetingHistoryController = require("../controllers/meetinghistory.controller");

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
router.get("/", meetingHistoryController.getAllHistory);
router.get("/:id", meetingHistoryController.getHistoryById);
router.get("/room/:roomId", meetingHistoryController.getHistoryByRoomId);
router.get("/user/:userId", meetingHistoryController.getHistoryByUserId);
router.get("/mentor/:mentorId", meetingHistoryController.getHistoryByMentorId);
router.get("/stats/duration", meetingHistoryController.getDurationStats);
router.post("/", meetingHistoryController.createHistory);

module.exports = router;