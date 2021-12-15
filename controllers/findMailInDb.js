const { Mail } = require("../models/mail.model");
 module.exports = findMailInDb = (request, response)=> {
	const { from } = request.body;
	 Mail.find({ from: from }, function (error, data) {
		if (error) {
			response.status(500).send({
				success: false,
				message: "Cannot connect to database " + error.message,
			});
		} else {
			// If email already there in db send false and data otherwise true
			if (data.length === 0) response.status(200).send({ success: true});
			else response.status(200).send({ success: false, data });
		}
	});
}

