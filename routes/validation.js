// Dependencies
const express = require("express");
const { findMailInDb } = require("../controllers/findMailInDb");

// Route
const validationRoute = express.Router();

//@Method : POST
//@Route : /validation
//@Description : To check whether we have credentials of sender or not
validationRoute.post("/", findMailInDb);

module.exports = { validationRoute };
