const express = require("express");
const app = express();
const port = 3000

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

app.listen(port, () => console.log("listening on ports", port));
