const express = require("express");
const mailRoute = express.Router();
const { uploadFileToAWS } = require("../helpers/uploadFileToAWS");
const { saveCredentials } = require("../helpers/saveCredentials");
const formidable = require("formidable");
const { sendEmail } = require("../helpers/sendMail");
const { saveContent } = require("../helpers/saveContent");
mailRoute.post("/", async function (request, response) {
	let form = new formidable.IncomingForm();
	console.log(process.env.ACCESS_KEY);
	console.log(process.env.AWS_SECRET);
	console.log(process.env.REGION);
	form.parse(request, async (formErr, fields, file) => {
		if (formErr) {
			return response
				.status(400)
				.json({ error: true, message: "Something went wrong!", err });
		}
		try {
			const {
				senderEmail,
				clientId,
				clientSecret,
				refreshToken,
				subject,
				receiverEmail,
				body,
				bcc,
			} = fields;
			let filePaths = [];
			let files = Object.keys(file);
			let slicedRecievers = receiverEmail.split("\n");

			for (let eachFile in files) {
				const { path } = await uploadFileToAWS(file[files[eachFile]]);
				path && filePaths.push({ fileName: files[eachFile], path });
			}

			sendEmail(
				senderEmail,
				clientId,
				clientSecret,
				refreshToken,
				subject,
				slicedRecievers,
				body,
				bcc.split(","),
				filePaths
			);
		} catch (error) {
			console.log(error.message);
		}
	});

	// Manual slicing needed : DONOT DELETE
	// const respo = await saveContent({
	// 	senderId: _id,
	// 	subject,
	// 	imagePath: awsResponse.path,
	// 	description,
	// 	recieverEmail: slicedRecievers.slice(0, slicedRecievers.length - 1),
	// });
});
module.exports = { mailRoute };
