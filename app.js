const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const { intitalizeDBConnection } = require("./database/db.connect");
const { mailRoute } = require("./routes/mail");
const { validationRoute } = require("./routes/validation");
// const formidable = require("express-formidable");
// app.use(formidable());
// var multer = require('multer');
// var upload = multer();
app.use(
	cors({
		origin: "*",
	})
);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// app.use(upload.array());
app.use(express.static("public"));

const PORT = 3001;

//Connecting to database
intitalizeDBConnection();

app.get("/", function (request, response) {
	response.status(200).send({ status: true, message: "Made get request" });
});

app.use("/send-mail", mailRoute);
app.use("/validation", validationRoute);

app.listen(PORT, () => {
	console.log("SERVER Started at ", PORT);
});
