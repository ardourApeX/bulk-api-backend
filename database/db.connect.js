const mongoose = require("mongoose");
function intitalizeDBConnection() {
	mongoose
		.connect(
			"mongodb+srv://dbbulk:dbbulk@cluster0.wqoml.mongodb.net/testing?retryWrites=true&w=majority"
		)
		.then(() => console.log("Connected to Database"))
		.catch((error) =>
			console.log(
				"Error occured while connecting to database => ",
				error.message
			)
		);
}
module.exports = { intitalizeDBConnection };
