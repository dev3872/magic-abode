const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const User = require("../../models/User");
const Connect = require("../../models/Connected");
const { check, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");

// @route    GET api/users
// @desc     Test api
// @access   Public
router.get("/", (req, res) => {
  console.log("server to client connected");
  res.send({ data: "client to server connected" });
});

// @route    POST api/users
// @desc     Register user
// @access   Public
router.post(
  "/",
  [
    check("firstName", "Name is required").not().isEmpty(),
    check("lastName", "Name is required").not().isEmpty(),
    check("email", "Please include a valid email").isEmail(),
    check(
      "password",
      "Please enter a password with 6 or more characters"
    ).isLength({ min: 6 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { firstName, lastName, email, password } = req.body;

    try {
      let user = await User.findOne({ email });

      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: "User already exists", param: "email" }] });
      }
      user = new User({
        firstName,
        lastName,
        email,
        password,
      });
      let pending = [];
      let connected = [];
      let connect = new Connect({
        email,
        pending,
        connected
      })

      const salt = await bcrypt.genSalt(10);

      user.password = await bcrypt.hash(password, salt);

      await user.save();
      await connect.save()
      const payload = {
        user: {
          id: user.id,
        },
      };

      jwt.sign(
        payload,
        config.get("jwtSecret"),
        { expiresIn: "5 days" },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);

module.exports = router;
