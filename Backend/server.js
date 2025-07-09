const express = require("express");
var cors = require("cors");
const auth = require("./routes/auth");
const path = require("path");
require("dotenv").config();
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(auth);
// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, "/Upload")));

var port = process.env.PORT || 5000;
var host = process.env.HOST;

app.listen(port, host, () => {
  console.log(`Example app listening on server ${host} port ${port}`);
});
