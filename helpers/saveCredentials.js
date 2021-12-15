const { Mail } = require("../models/mail.model");
async function saveCredentials(from, clientId, clientSecret, refreshToken) {
	const payload = {
		from,
		clientId,
		clientSecret,
		refreshToken,
	};
	const mail = new Mail(payload);
	try {
		const response = await mail.save();
		console.log("Credentials Saved");
		return { success: true, _id: response._id };
	} catch (error) {
		console.log("Error Occured while saving credentials ", error.message);
		return { success: false, message: error.message };
	}
}
module.exports = { saveCredentials };
