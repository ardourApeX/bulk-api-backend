const { MailBody } = require("../models/mail.body.model");
async function saveContent({
	senderId,
	subject,
	imagePath,
	description,
	recieverEmail,
}) {
	const payload = {
		subject,
		imagePath,
		description,
		recieverEmail,
		senderId,
	};
	const mailContent = new MailBody(payload);
	try {
		const response = await mailContent.save();
		console.log("Data Saved in Mail Body");
		return { success: true, _id: response._id };
	} catch (error) {
		console.log("Error occured while saving mail body -> ", error.message);
		return { success: false, message: error.message };
	}
}
module.exports = { saveContent };
