require("dotenv").config();
var AWS = require("aws-sdk");

//AWS access details
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY,
  region: process.env.AWS_BUCKET_REGION,
});
const detectLabel=(address)=>{//input parameters
var params = {
  Image: {
    S3Object: {
      Bucket: "exploment",
      Name: address,
    },
  },

  ProjectVersionArn:process.env.AWS_PROJECT_VERSION
};

//Call AWS Rekognition Class
const rekognition = new AWS.Rekognition();
//Detect text
return rekognition.detectCustomLabels(params).promise();
}

exports.detectLabel=detectLabel;
