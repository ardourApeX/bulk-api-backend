const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const { s3bucket } = require("../config/s3");
const { uploadFileToAWS } = require("./uploadFileToAWS");
const { MailBody } = require("../models/mail.body.model");
const { Mail } = require("../models/mail.model");
const OAuth2 = google.auth.OAuth2;
const mongoose = require("mongoose");

function sendEmail(
	email,
	clientId,
	clientSecret,
	refreshToken,
	recieverEmail,
	subject,
	description,
	mailId,
	image
) {
	// if (mailId.length<=0) {
	// 	console.log("HII")
	// 	const newData = {
	// 		from: email,
	// 		clientId: clientId,
	// 		clientSecret: clientSecret,
	// 		refreshToken: refreshToken,
	// 	};
	// 	console.log("NEW DATA === > ", newData);
	// 	try {
	// 		const NewMail = new Mail(newData);
	// 		mailId = NewMail._id
	// 		console.log(mailId)
	// 		 NewMail.save();
	// 		console.log("Saved");
	// 	} catch (error) {
	// 		console.log("Error while saving",error);
	// 	}
	// }
	// else{
	// 		let o_id = mongoose.Types.ObjectId(mailId)
	// 		console.log(o_id)
	// 		Mail.findById(o_id, function (err, user) {
	// 			if (err) {console.log(err)}
	// 			console.log(user.refreshToken)
	// 		clientId = user.clientId
	// 		clientSecret = user.clientSecret
	// 		refreshToken = user.refreshToken
	// 		console.log("here is refresh token", refreshToken, " ", clientId, clientSecret)
	// 		  });
	// }
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

	var base64data = new Buffer(image.buffer, "binary");

	let imagepath = "";

	const params = {
		Bucket: "gbgc-bucket",
		Key: image.originalname,
		Body: base64data,
	};
	s3bucket.upload(params, function (error, data) {
		if (error) {
			console.log(error);
		} else {
			console.log(data);
			imagepath = data.Location;
			const mail = new MailBody({
				Subject: subject,
				description: description,
				recieversEmail: recieverEmail,
				imagePath: data.Location,
			});
			mail.save();
		}
	});

	const totalRecievers = recieverEmail.length;
	console.log(totalRecievers);

	var i = 0;
	function sendingBulkMail() {
		setTimeout(function () {
			const sendersList = recieverEmail.slice(i, i + 495);
			const mailOptions = {
				to: ["joygupta501@gmail.com", "devparmar3777@gmail.com"],
				from: email,
				bcc: sendersList,
				subject: subject,
				html: description + 'Embedded image: <img src="cid:unique@kreata.ee"/>',
				attachments: [
					{
						filename: "cat.jpg",
						path: imagepath,
						cid: "unique@kreata.ee", //same cid value as in the html img src
					},
				],
			};
			smtpTransport.sendMail(mailOptions, function (err) {
				if (err) {
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
	}
	sendingBulkMail();

	return;
}

module.exports = { sendEmail };
