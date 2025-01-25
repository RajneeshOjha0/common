const express = require("express");

const router = express.Router();
const { user, user2 , userData ,insertUserData} = require("../Controller/User");

console.log(user, "dfhhdfh");
router.get("/", user);
router.get("/GET", user2);
router.get("/user", userData);
router.post("/user", insertUserData);

module.exports = router;
