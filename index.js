const express = require("express");
const app = express();
require('dotenv').config()
const port = process.env.PORT
const importFromS3 = require('./importFromS3')
app.use(express.json());

app.use("/firstApi", (req, res) => {
  console.log("firstApi called")
  res.send("firstApi");
});

app.use("/secondApi", (req, res) => {
  console.log("secondApi called")
  res.send("secondApi");
});

app.use("/thirdApi", (req, res) => {
  console.log("thirdApi called")
  res.send("thirdApi");
});

app.use("/fourthApi", (req, res) => {
  console.log("fourthApi called")
  res.send("fourthApi");
});

app.post("/downloadLog",async (req, res) => {
  try {
    const result = await importFromS3.downloadS3FilesByDate(req.body.date)
    res.send(result);
  } catch (error) {
    console.error(error)
    res.send(error.message)
  }

});

app.listen(port, () => console.log("listening on ports", port));
