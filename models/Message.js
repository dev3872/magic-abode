const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema({
	senders: [
		{
			type: String,
			required: true,
			unique: true,
		},
	],
	messages: [
		{
			text: { type: String },
			createdBy: {
				type: String,
			},
		},
	],
});

module.exports = mongoose.model("message", MessageSchema);
