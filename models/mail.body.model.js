const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const mailSchema = new mongoose.Schema({
	subject: {
		type: String,
		required: true,
	},
	imagePath: {
		type: String,
		required: true,
	},
	description: {
		type: String,
		required: true,
	},
	recieverEmail: [
		{
			type: String,
			required: true,
		},
	],
	senderId: {
		type: ObjectId,
		ref: "Mail",
		required: true,
	},
});

const MailBody = mongoose.model("MailBody", mailSchema);
module.exports = { MailBody };
