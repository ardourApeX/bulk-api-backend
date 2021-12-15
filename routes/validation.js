const express = require("express");
const validationRoute = express.Router();

const findMailInDb = require("../controllers/findMailInDb");

//@route to validate whether the senders mail is already there in database or not
validationRoute.post("/", findMailInDb);

module.exports = { validationRoute };
