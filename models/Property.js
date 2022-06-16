const mongoose = require("mongoose");

const PropertySchema = new mongoose.Schema({
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "user",
	},
	postedBy: {
		type: String,
	},
	userTypeSelect: { type: Map },
	propertyForSelect: { type: Map },
	propertyTypeSelect: { type: Map },
	inputLocationCity: { type: Map },
	inputLocationLocality: { type: Map },
	imageDetails: [
		{
			type: String,
		},
	],
	furnishings: [
		{
			type: String,
		},
	],
	amenities: [
		{
			type: String,
		},
	],
	inputBuiltIn: { type: Map },
	inputCarpet: { type: Map },
	propertyBedroom: { type: Map },
	propertyBathroom: { type: Map },
	propertyStudy: { type: Map },
	propertyParking: { type: Map },
	inputCost: { type: Map },
	inputMaintenence: { type: Map },
	builtInUnit: { type: Map },
	date: {
		type: Date,
		default: Date.now,
	},
});

module.exports = mongoose.model("property", PropertySchema);
