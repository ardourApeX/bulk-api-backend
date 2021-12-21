// Dependencies
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");

// Controllers
const { mailRoute } = require("./routes/mail");

app.use(
	cors({
		origin: "*",
	})
);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const PORT = 3001;

app.get("/", function (request, response) {
	response.status(200).send({ status: true, message: "Made get request" });
});
app.use("/mail", mailRoute);
app.use("/testing", function testing(req, res) {
	console.log(req.files);
	res.status(200).send({ success: true });
});
app.listen(PORT, () => {
	console.log("SERVER Started at ", PORT);
});
