const AWS = require("aws-sdk");
const fs = require("fs");
const path = require("path");
require("dotenv").config();
const unzip = require("./unzip");

AWS.config.update({
  region: process.env.AWS_REGION_NAME,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const s3 = new AWS.S3();

async function downloadS3FilesByDate(date) {
  try {
    const params = {
      Bucket: process.env.AWS_S3_BUCKET,
    };

    const s3Objects = await s3.listObjectsV2(params).promise();

    for (const s3Object of s3Objects.Contents) {
      const key = s3Object.Key;
      if (key.includes(date)) {
        await downloadS3File(key);
      }
    }

    console.log(`All '.gz' files for date '${date}' downloaded successfully.`);
  } catch (error) {
    console.error("Error:", error);
  }
}

async function downloadS3File(fullPath) {
  try {
    const fileName = path.basename(fullPath);
    console.log("fileName:", fileName);

    const rootFolder = path.join(__dirname, "s3files");
    if (!fs.existsSync(rootFolder)) {
      fs.mkdirSync(rootFolder);
    }

    const localFilePath = path.join(rootFolder, fileName);

    const fileData = await s3
      .getObject({ Bucket: process.env.AWS_S3_BUCKET, Key: fullPath })
      .promise();

    fs.writeFileSync(localFilePath, fileData.Body);
    await unzip.decompressGzipFile(localFilePath, __dirname + "/logs/" + fileName);
    fs.unlinkSync(localFilePath);
    console.log(
      `File '${fullPath}' downloaded to '${localFilePath}' successfully.`
    );
    return {
      success: true,
      message: `File '${fullPath}' downloaded successfully.`,
    };
  } catch (error) {
    console.error("Error:", error);
    return { success: false, message: `Error downloading file '${fullPath}'.` };
  }
}

module.exports = {
  downloadS3FilesByDate,
};
