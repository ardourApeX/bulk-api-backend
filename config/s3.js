const multer = require('multer');
const AWS = require('aws-sdk');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

let s3bucket = new AWS.S3({
    accessKeyId: "AKIA32FTPMUPZCXA2JF5",
    secretAccessKey: "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",
    region: "ap-south-1"
  });
  
  module.exports = {
      s3bucket
  }