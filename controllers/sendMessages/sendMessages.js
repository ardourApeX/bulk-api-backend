var unirest = require("unirest");
var requests = unirest("POST", "https://www.fast2sms.com/dev/bulkV2");
async function sendMessages(request, response) {
	const { authorization, message, numbers } = request.body;

	requests.headers({
		authorization,
	});
	requests.form({
		message,
		route: "v3",
		numbers,
	});
	requests.end(function (result) {
		if (result.error) {
			return response
				.status(400)
				.send({ success: false, message: result.error.message });
		}
		return response
			.status(200)
			.send({ success: true, message: "Messages sent successfully" });
	});
}
module.exports = { sendMessages };
