const AWS = require("aws-sdk");
const fs = require("fs");
const path = require("path");
require("dotenv").config();
const unzip = require("./unzip")

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
async function downloadS3File(fullPath) {
  try {
    // Extract the file name from the full path
    const fileName = path.basename(fullPath);
    console.log("fileName:",fileName);
    // Create the root folder if it doesn't exist
    const rootFolder = path.join(__dirname, "s3files");
    if (!fs.existsSync(rootFolder)) {
      fs.mkdirSync(rootFolder);
    }

    // Determine the local file path
    const localFilePath = path.join(rootFolder, fileName);

    // Download the file from S3 to the local directory
    const fileData = await s3.getObject({ Bucket: process.env.AWS_S3_BUCKET, Key: fullPath }).promise();

    // Save the file to the local directory
    fs.writeFileSync(localFilePath, fileData.Body);
    unzip.decompressGzipFile(localFilePath, __dirname+"/logs/data.txt")

    console.log(`File '${fullPath}' downloaded to '${localFilePath}' successfully.`);
    return { success: true, message: `File '${fullPath}' downloaded successfully.` };
  } catch (error) {
    console.error("Error:", error);
    return { success: false, message: `Error downloading file '${fullPath}'.` };
  }
}

module.exports = {
  downloadS3File,
};
