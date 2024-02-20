const AWS = require("aws-sdk");
const fs = require("fs");
const path = require('path');
require('dotenv').config();

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

async function syncS3BucketToLocal(bucketName) {
  try {
    // Create the root folder if it doesn't exist
    const rootFolder = path.join(__dirname, 's3files');
    if (!fs.existsSync(rootFolder)) {
      fs.mkdirSync(rootFolder);
    }

    // List objects in the bucket
    const objects = await s3.listObjectsV2({ Bucket: bucketName }).promise();

    // Download each object
    await Promise.all(objects.Contents.map(async (object) => {
      const key = object.Key;
      const filePath = path.join(rootFolder, key);
      const fileStream = fs.createWriteStream(filePath);

      const params = {
        Bucket: bucketName,
        Key: key
      };

      // Stream the object from S3 to the local file
      await s3.getObject(params).createReadStream().pipe(fileStream);

      console.log(`Downloaded: ${key}`);
    }));

    console.log('S3 bucket synced to local directory successfully.');
  } catch (error) {
    console.error('Error:', error);
  }
}

syncS3BucketToLocal(process.env.AWS_S3_BUCKET);
