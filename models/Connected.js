const mongoose = require("mongoose");

const ConnectedSchema = new mongoose.Schema({
	email: {
		type: String,
		required: true,
		unique: true,
	},
	pending: [
		{
			type: String,
		},
	],
	connected: [
		{
			type: String,
		},
	],
});

module.exports = mongoose.model("connected", ConnectedSchema);
