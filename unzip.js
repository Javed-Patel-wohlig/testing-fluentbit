const fs = require('fs');
const zlib = require('zlib');
const path = require("path");

function decompressGzipFile(gzipFilePath, outputFilePath) {
  return new Promise((resolve, reject) => {
    // Create a read stream for the gzip file
    const readStream = fs.createReadStream(gzipFilePath);

    // Create a write stream for the decompressed file
    const writeStream = fs.createWriteStream(outputFilePath);

    // Pipe the read stream through the gzip decompression stream
    readStream.pipe(zlib.createGunzip())
      // Pipe the decompressed data to the write stream
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

// Example usage:
const rootFolder = path.join(__dirname, "s3files");
// const gzipFilePath = rootFolder + "/13_06_31.gz-objectiQJOqs7c";
// const outputFilePath = rootFolder + "/file.txt"

module.exports = {
    decompressGzipFile
}

