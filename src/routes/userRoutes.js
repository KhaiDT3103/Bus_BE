const express = require("express");
const router = express.Router();
const userController = require('../controllers/userControllers');

router.get("/", userController.getAllUser);
router.post("/addUser", userController.addUser);
router.post("/login", userController.loginUser);

module.exports = router;