const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const e = require("express");
const OAuth2 = google.auth.OAuth2;

async function sendEmail({
	senderEmail,
	clientId,
	clientSecret,
	refreshToken,
	subject,
	slicedReceivers: receivers,
	body: description,
	bcc,
	filePaths,
}) {
	const oauth2Client = new OAuth2(
		clientId, // ClientID
		clientSecret, // Client Secret
		"https://developers.google.com/oauthplayground" // Redirect URL
	);
	oauth2Client.setCredentials({
		refresh_token: refreshToken,
	});
	const accessToken = oauth2Client.getAccessToken();
	var smtpTransport = await nodemailer.createTransport({
		service: "gmail",
		auth: {
			type: "OAuth2",
			user: senderEmail,
			clientId: clientId,
			clientSecret: clientSecret,
			refreshToken: refreshToken,
			accessToken: accessToken,
		},
	});

	const totalRecievers = bcc.length;

	var i = 0;
	let completed = false;
	function sendingBulkMail() {
		return new Promise((resolve, reject) => {
			setTimeout(function () {
				const sendersList = bcc.slice(i, i + 495);
				const mailOptions = {
					to: receivers,
					from: senderEmail,
					bcc: sendersList,
					subject: subject,
					html: description,
					attachments: filePaths,
				};
				smtpTransport.sendMail(mailOptions, function (err) {
					if (err) {
						console.log("Error occured while sending mails");
						console.log(err.message);
						reject({ success: false, message: err.message, status: 400 });
					} else {
						console.log("Mail done");
					}
				});

				i += 496;
				if (i < totalRecievers) {
					sendingBulkMail();
				} else {
					completed = true;
					console.log("completed ", completed);
					resolve({ success: true, message: "all mails done", status: 200 });
				}
			}, 20000);
		});
	}

	 sendingBulkMail();
}

module.exports = { sendEmail };
