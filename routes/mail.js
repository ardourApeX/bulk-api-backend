const express = require("express");
const mailRoute = express.Router();
const { uploadFileToAWS } = require("../helpers/uploadFileToAWS");
const { saveCredentials } = require("../helpers/saveCredentials");
const formidable = require("formidable");
const { sendEmail } = require("../helpers/sendMail");
const { saveContent } = require("../helpers/saveContent");
mailRoute.post("/", async function (request, response) {
	let form = new formidable.IncomingForm();

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
			let slicedReceivers = receiverEmail.split(",");
			for (let eachFile in files) {
				const { path } = await uploadFileToAWS(file[files[eachFile]]);
				path && filePaths.push({ fileName: files[eachFile], path });
			}
			const temp = await sendEmail({
				senderEmail,
				clientId,
				clientSecret,
				refreshToken,
				subject,
				slicedReceivers,
				body,
				bcc: bcc.split("\n"),
				filePaths,
			});
			console.log("sending back response");
			return response
				.status(temp.status)
				.send({ success: temp.success, message: temp.message });
		} catch (error) {
			return response
				.status(400)
				.send({ success: false, message: error.message });
		}
	});
});
module.exports = { mailRoute };
