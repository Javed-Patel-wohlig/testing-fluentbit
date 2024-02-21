const fs = require('fs');
const zlib = require('zlib');
const path = require("path");

function decompressGzipFile(gzipFilePath, outputFilePath) {
  return new Promise((resolve, reject) => {

    const readStream = fs.createReadStream(gzipFilePath);

    const writeStream = fs.createWriteStream(outputFilePath);


    readStream.pipe(zlib.createGunzip())
      .pipe(writeStream)
      .on('finish', () => {
        console.log(`File decompressed and saved to ${outputFilePath}`);
        resolve(outputFilePath);
      })
      .on('error', (err) => {
        console.error('Error decompressing file:', err);
        reject(err);
      });
  });
}


const rootFolder = path.join(__dirname, "s3files");
// const gzipFilePath = rootFolder + "/13_06_31.gz-objectiQJOqs7c";
// const outputFilePath = rootFolder + "/file.txt"

module.exports = {
    decompressGzipFile
}

