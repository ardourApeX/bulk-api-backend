const express = require("express");
const mailRoute = express.Router();
var multer = require("multer");
var upload = multer();
const { uploadFileToAWS } = require("../helpers/uploadFileToAWS");
var type = upload.single("image");
const { saveCredentials } = require("../helpers/saveCredentials");
const { saveContent } = require("../helpers/saveContent");

mailRoute.post("/", type, async function (request, response) {
	var {
		_id,
		email: from,
		clientId,
		clientSecret,
		refreshToken,
		recieverEmail,
		subject,
		description,
	} = request.body;

	if (_id === undefined) {
		//If the sender email is not in db, save it first
		var functionResponse = await saveCredentials(
			from,
			clientId,
			clientSecret,
			refreshToken
		);
		if (!functionResponse.success) {
			//If there is a duplicacy or some ISE then send control back to FE
			response.status(500).send({ error: functionResponse.message });
		} else {
			_id = functionResponse._id;
		}
	}
	// Now save mail content to schema

	// First upload the doc to aws
	var awsResponse = {};

	try {
		const image = request.file;
		const base64data = Buffer.from(image.buffer, "binary");
		awsResponse = await uploadFileToAWS(image.originalname, base64data);
		console.log(awsResponse);
	} catch (error) {
		response
			.status(500)
			.send({ success: false, message: "Error while uploading to AWS" });
	}
	// Manual slicing needed : DONOT DELETE
	let slicedRecievers = recieverEmail.split("\n");
	const respo = await saveContent({
		senderId: _id,
		subject,
		imagePath: awsResponse.path,
		description,
		recieverEmail: slicedRecievers.slice(0, slicedRecievers.length - 1),
	});
	// sendEmail(
	// 	from,
	// 	clientId,
	// 	clientSecret,
	// 	refreshToken,
	// 	recieverEmail.split("\n"), //Splitting all the mails
	// 	subject,
	// 	description,
	// 	mailId,
	// 	image
	// );
});
module.exports = { mailRoute };
