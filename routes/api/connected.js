const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const User = require("../../models/User");
const { check, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
const Connected = require("../../models/Connected");
const Message = require("../../models/Message");

// @route    GET api/users
// @desc     Test api
// @access   Public
router.get("/", (req, res) => {
	console.log("server to client connected");
	res.send({ data: "client to server connected" });
});
router.get("/pending", auth, async (req, res) => {
	try {
		const user = await User.findById(req.user.id);
		const conn = await Connected.find({ email: user.email });
		res.send(conn[0].pending);
	} catch (error) {
		console.log(error);
	}
});
router.get("/approve", auth, async (req, res) => {
	try {
		const user = await User.findById(req.user.id);
		const conn = await Connected.find({ email: user.email });
		res.send(conn[0].connected);
	} catch (error) {
		console.log(error);
	}
});
router.post("/send", auth, async (req, res) => {
	try {
		const user = await User.findById(req.user.id);
		const { message, receiver } = req.body;
		await Message.findOneAndUpdate(
			{ senders: user.email, senders: receiver },
			{ $push: { messages: { text: message, createdBy: receiver } } },
			{ upsert: true, new: true, setDefaultsOnInsert: true }
		);
	} catch (error) {
		console.log(error);
	}
});
router.post("/getMessage", auth, async (req, res) => {
	try {
		console.log("hello")
		const user = await User.findById(req.user.id);
		const { receiver } = req.body;
		const msg = await Message.find();
		console.log(msg)
		res.send(msg[0].messages)
	} catch (error) {
		console.log(error);
	}
});
router.post("/approveRequest", auth, async (req, res) => {
	try {
		const user = await User.findById(req.user.id);
		await Connected.findOneAndUpdate(
			{ email: user.email },
			{ $pull: { pending: req.body.email } }
		);
		await Connected.findOneAndUpdate(
			{ email: user.email },
			{ $push: { connected: req.body.email } }
		);
		res.send("hi");
	} catch (error) {
		console.log(error);
	}
});
router.post("/connectRequest", auth, async (req, res) => {
	try {
		const user = await User.findById(req.user.id);
		const { email } = req.body;
		const conn = await Connected.find({ email: user.email });
		if (conn[0].connected.indexOf(email) == -1) {
			if (conn[0].pending.indexOf(email) == -1) {
				await Connected.findOneAndUpdate(
					{ email: user.email },
					{ $push: { pending: email } }
				);
			}
		}
		res.send("done");
	} catch (error) {
		console.log(error);
	}
});

module.exports = router;
