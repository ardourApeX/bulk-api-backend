const { Mail } = require("../models/mail.model");

async function findMailInDb(request, response) {
	const { from } = request.body;
	try {
		//Checking if credentials exists or not
		const mails = await Mail.find({ from: from });
		if (mails) return response.status(200).send({ success: true });
		else return response.status(200).send({ success: false });
	} catch (error) {
		console.log("Error occured ", error.message);
		response.status(500).send({
			success: false,
			message: "Cannot connect to database " + error.message,
		});
	}
}
exports.findMailInDb = findMailInDb;
