const mongoose = require("mongoose");

const mailSchema = new mongoose.Schema({
	from: {
		type: String,
		required: true,
		unique: true,
	},
	clientId: {
		type: String,
		required: true,
	},
	clientSecret: {
		type: String,
		required: true,
	},
	refreshToken: {
		type: String,
		required: true,
	},
	
});
const Mail = mongoose.model("Mail", mailSchema);
module.exports = { Mail };
