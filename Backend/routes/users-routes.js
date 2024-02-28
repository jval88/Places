const express = require("express");
const { check } = require("express-validator");

const {
  getUsers,
  createUser,
  logIn,
} = require("../controllers/users-controller");

const router = express.Router();

router.get("/", getUsers);

router.post(
  "/signup",
  [
    check("name").not().isEmpty(),
    check("email").normalizeEmail().isEmail(),
    check("password").isLength(6),
  ],
  createUser
);

router.post("/login", logIn);

module.exports = router;
