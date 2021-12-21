const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const { s3bucket } = require("../config/s3");
const { MailBody } = require("../models/mail.body.model");
const { Mail } = require("../models/mail.model");
const OAuth2 = google.auth.OAuth2;
const mongoose = require("mongoose");

function sendEmail(
	email,
	clientId,
	clientSecret,
	refreshToken,
	subject,
	receivers,
	description,
	bcc,
	filePaths
) {
	try {
		const oauth2Client = new OAuth2(
			clientId, // ClientID
			clientSecret, // Client Secret
			"https://developers.google.com/oauthplayground" // Redirect URL
		);
		oauth2Client.setCredentials({
			refresh_token: refreshToken,
		});
		const accessToken = oauth2Client.getAccessToken();
		const smtpTransport = nodemailer.createTransport({
			service: "gmail",
			auth: {
				type: "OAuth2",
				user: email,
				clientId: clientId,
				clientSecret: clientSecret,
				refreshToken: refreshToken,
				accessToken: accessToken,
			},
		});
	} catch (error) {
		console.log("error aagu", error.message);
	}
	const totalRecievers = bcc.length;
	console.log(totalRecievers);

	var i = 0;
	function sendingBulkMail() {
		try {
			setTimeout(function () {
				const sendersList = bcc.slice(i, i + 495);
				const mailOptions = {
					to: receivers,
					from: email,
					bcc: sendersList,
					subject: subject,
					html: description,
					attachments: filePaths,
				};
				smtpTransport.sendMail(mailOptions, function (err) {
					if (err) {
						console.log("error");
						console.log(err.message);
					} else {
						console.log("Mail done");
					}
				});

				i += 496;
				if (i < totalRecievers) {
					sendingBulkMail();
				}
			}, 20000);
		} catch (error) {
			console.log("error generated ", error.message);
		}
	}
	try {
		sendingBulkMail();
	} catch (error) {
		console.log(error.message);
	}

	return;
}

module.exports = { sendEmail };
