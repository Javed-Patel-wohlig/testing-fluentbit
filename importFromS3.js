const AWS = require("aws-sdk");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

// Configure AWS credentials and region
AWS.config.update({
  region: process.env.AWS_REGION_NAME,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// Create an S3 object
const s3 = new AWS.S3();

async function downloadS3Files(bucketName) {
  try {
    // List all objects in the specified bucket
    const objects = await s3.listObjectsV2({ Bucket: bucketName }).promise();

    // Create the root folder if it doesn't exist
    const rootFolder = path.join(__dirname, "s3files");
    if (!fs.existsSync(rootFolder)) {
      fs.mkdirSync(rootFolder);
    }

    // Iterate through each object in the bucket
    for (const object of objects.Contents) {
      const key = object.Key;

      // Download the object from S3
      const params = { Bucket: bucketName, Key: key };
      const { Body } = await s3.getObject(params).promise();

      // Determine the file path to save
      const filePath = path.join(rootFolder, key);

      // Save the object to the local file system
      fs.writeFileSync(filePath, Body);
      console.log(`Downloaded ${key} to ${filePath}`);
    }

    console.log("All files downloaded successfully.");
  } catch (error) {
    console.error("Error:", error);
  }
}

downloadS3Files(process.env.AWS_S3_BUCKET);
