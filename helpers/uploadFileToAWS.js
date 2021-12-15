const { s3bucket } = require("../config/s3");
async function uploadFileToAWS(key, body, bucketName = "gbgc-bucket") {
	const params = {
		Bucket: bucketName,
		Key: key,
		Body: body,
	};
	return new Promise((resolve, reject) => {
		s3bucket.upload(params, function (error, data) {
			if (error) {
				console.log(
					"Some error occured while uploading file to aws -> ",
					error.message
				);
				reject({ success: false });
			} else {
				console.log("Data Saved on AWS");
				return resolve({ success: true, path: data.Location });
			}
		});
	});
}
module.exports = { uploadFileToAWS };
