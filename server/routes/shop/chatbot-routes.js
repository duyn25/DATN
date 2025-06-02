// routes/shop/chatbot-routes.js
const express = require("express");
const router = express.Router();
const { chatWithBot } = require("../../controller/shop/chatbot-controller");

router.post("/chat", chatWithBot);

module.exports = router;
