const express = require("express");

const router = express.Router();
const { user, user2 , userData ,insertUserData,login, updateUser, createUser} = require("../Controller/User");
const { verifyToken } = require("../Middleware/JwtClient");

console.log(user, "dfhhdfh");
router.get("/", user);
router.get("/GET", user2);
router.get("/user",verifyToken, userData);
router.post("/user-i", insertUserData);

router.post("/login" ,login);
router.post("/update-user",updateUser);
router.post("/create-user",createUser);

module.exports = router;
