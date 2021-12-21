const express = require("express");
const messageRoute = express.Router();
const { sendMessages } = require("../controllers/sendMessages/sendMessages");
messageRoute.post("/", sendMessages);
module.exports = { messageRoute };
