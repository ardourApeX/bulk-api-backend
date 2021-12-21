// Dependencies
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");

// Connection
const { intitalizeDBConnection } = require("./database/db.connect");

// Controllers
const { mailRoute } = require("./routes/mail");
const { validationRoute } = require("./routes/validation");

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
app.use("/mail", mailRoute);
app.use("/validation", validationRoute);
app.use("/testing", function testing(req, res) {
	console.log(req.files);
	res.status(200).send({ success: true });
});
app.listen(PORT, () => {
	console.log("SERVER Started at ", PORT);
});
