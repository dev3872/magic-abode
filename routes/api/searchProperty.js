const express = require("express");
const { set } = require("mongoose");
const router = express.Router();
const auth = require("../../middleware/auth");
const Property = require("../../models/Property");
const User = require("../../models/User");

const mailjet = require("node-mailjet").connect(
	"687ab887e5f2be6699b6acd41e5a83ff",
	"739b97b34515f83d42483a2535b2a9e0"
);
router.get("/getAll", async (req, res) => {
	try {
		const propertyValue = await Property.find().populate("user");
		res.send(propertyValue);
	} catch (error) {}
});
router.get("/myProperty", auth, async (req, res) => {
	try {
		const property = await Property.find({ user: req.user.id }).populate(
			"user"
		);
		res.send(property);
	} catch (error) {}
});
router.post("/filterProperty", auth, async (req, res) => {
	try {
		const { propertyType, city, bedroom } = req.body;
		console.log(propertyType, city, bedroom);
		let property1 = null;
		let property2 = null;
		let property3 = null;
		if (propertyType != "") {
			property1 = await Property.find({
				"propertyTypeSelect.propertyTypeSelect": propertyType,
			}).populate("user");
		}
		if (city != "") {
			property2 = await Property.find({
				"inputLocationCity.inputLocationCity": city,
			}).populate("user");
			for (let index = 0; index < property2.length; index++) {
				const element = property2[index];
				property1.push(element);
			}
		}
		if (bedroom != "") {
			property3 = await Property.find({
				"propertyBedroom.propertyBedroom": bedroom,
			}).populate("user");
			for (let index = 0; index < property3.length; index++) {
				const element = property3[index];
				property1.push(element);
			}
		}
		res.send(property1);
	} catch (error) {
		console.log(error);
	}
});
router.post("/search", async (req, res) => {
	const { postedBy, bedroom, constructionStatus, postedFor, propertyType } =
		req.body;
	const property = await Property.find().populate("user");
	let propertyFilter = property;
	let propertyFilter1;
	if (propertyType[0] !== "") {
		propertyFilter = propertyFilter.filter(
			(pro) =>
				propertyType.indexOf(pro.propertyType.get("propertySubType")) !== -1
		);
	}
	if (postedFor) {
		propertyFilter = propertyFilter.filter(
			(pro) =>
				pro.listingPropertyFor.get("listingFor").localeCompare(postedFor) === 0
		);
	}
	if (postedBy) {
		propertyFilter = propertyFilter.filter((pro) => pro.postedBy === postedBy);
	}
	if (bedroom) {
		propertyFilter = propertyFilter.filter(
			(pro) => pro.propertyDetails.get("bedrooms") === bedroom
		);
	}
	if (constructionStatus) {
		propertyFilter = propertyFilter.filter(
			(pro) => pro.pricing.get("Availability") === constructionStatus
		);
	}
	res.json(propertyFilter);
});

router.post("/contactUser", auth, async (req, res) => {
	console.log(req.body);
	res.json({ works: true });
	try {
		let user = await User.findById(req.body.id);
		if (user) {
			let user1 = await User.findById(req.user.id);
			const request = mailjet.post("send", { version: "v3.1" }).request({
				Messages: [
					{
						From: {
							Email: "node.jsdev3872@gmail.com",
							Name: "FlexiAbode",
						},
						To: [
							{
								Email: user.email,
								Name: user.name,
							},
						],
						Subject: "FlexiAbode property lookup",
						TextPart: `Hi, I am intrested in your property posted at FlexiAbode. Please contact me at ${user1.email}. Thank you.`,
						HTMLPart: `<h3>Hi, I am intrested in your property posted at FlexiAbode. Please contact me at ${user1.email}. Thank you.FlexiAbode helps you post and search properties at your ease</h3>`,
						CustomID: "AppGettingStartedTest",
					},
				],
			});
			request
				.then((result) => {
					res.json({ success: true });
				})
				.catch((err) => {
					console.log(err.statusCode);
				});
		}
	} catch (err) {
		console.error(err.message);
		res.status(500).send("Server error");
	}
});

module.exports = router;
