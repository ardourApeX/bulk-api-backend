const AWS = require("aws-sdk");
require("dotenv").config();
let s3bucket = new AWS.S3({
	accessKeyId: process.env.ACCESS_KEY,
	secretAccessKey: process.env.AWS_SECRET,
	region: process.env.REGION,
});

module.exports = {
	s3bucket,
};
