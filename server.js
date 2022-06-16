const express = require("express");
const app = express();
const mongoose = require("mongoose");
const connectDB = require("./config/db");
const users = require("./routes/api/users");
const auth = require("./routes/api/auth");
const connected = require("./routes/api/connected");
const cors = require("cors");
const postProperty = require("./routes/api/post-property");
const searchProperty = require("./routes/api/searchProperty");
const path = require("path");
const port = 4000;

const multer = require("multer");
const storage = multer.diskStorage({
	destination: function (req, file, callback) {
		callback(null, "uploads/");
	},
	filename: function (req, file, callback) {
		callback(null, Date.now() + ".jpg");
	},
});
const upload = multer({ storage: storage });

//connect Database
connectDB();

// Init Middleware
app.use(express.json());
app.use(cors());
app.use(express.static("uploads"));
// Define Routes

app.post("/images", upload.single("image"), (req, res) => {
	console.log("Hello");
	console.log(req.file);
	res.send(req.file.filename);
});
app.use("/api/users", users);
app.use("/api/auth", auth);
app.use("/api/connect", connected);
app.use("/api/postProperty", postProperty);
app.use("/api/searchProperty", searchProperty);

if (process.env.NODE_ENV === "production") {
	// Set static folder
	app.use(express.static("client/build"));

	app.get("*", (req, res) => {
		res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
	});
}

app.listen(process.env.PORT || port, (err) => {
	if (!err) {
		console.log(`Server started at port ${port}`);
	} else {
		console.log(err);
	}
});
