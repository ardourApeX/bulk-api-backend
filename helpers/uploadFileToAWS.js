const { s3bucket } = require("../config/s3");
const fs = require("fs");
async function uploadFileToAWS(file, bucketName = "gbgc-bucket") {
	return new Promise((resolve, reject) => {
		fs.readFile(file.path ? file.path : file.filepath, (readErr, readData) => {
			if (readErr) {
				return res.status(400).json({
					error: true,
					message: "Failed to Read the File!",
					readErr,
				});
			}
			const params = {
				Bucket: bucketName,
				Key: file.name ? file.name : file.originalFilename + new Date(),
				Body: readData, //*
				ACL: "public-read",
			};
			s3bucket.upload(params, function (error, data) {
				if (error) {
					console.log(
						"Some error occured while uploading file to aws -> ",
						error.message
					);
					reject({ success: false });
				} else {
					console.log(data.Location);
					return resolve({ success: true, path: data.Location });
				}
			});
		});
	});
}
module.exports = { uploadFileToAWS };
