
const express = require("express");
const { register, login, getMyProfile, logout, getInfoById, getAll } = require("../controller/user");
const { checkAuth } = require("../middleware/authentication");

const router = express.Router();

router.post("/new", register);
router.post("/login", login);

router.get("/logout", logout);

router.get("/me", checkAuth, getMyProfile);

router.get("/user/:id", getInfoById);

router.get("/users", getAll);

router.get("/", (req, res) => {
    res.send("Hello from user route");
});

module.exports = router;