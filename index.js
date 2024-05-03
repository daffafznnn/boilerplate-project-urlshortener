require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();

const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/public", express.static(`${process.cwd()}/public`));

let urlDatabase = {};
let shortUrlCounter = 1;

app.post("/api/shorturl", function (req, res) {
  const originalUrl = req.body.url;

  const urlRegex = /^(ftp|http|https):\/\/[^ "]+$/;
  if (!urlRegex.test(originalUrl)) {
    return res.status(400).json({ error: "invalid url" });
  }

  const shortUrl = shortUrlCounter++;
  urlDatabase[shortUrl] = originalUrl;

  return res.json({ original_url: originalUrl, short_url: shortUrl });
});

app.get("/api/shorturl/:short_url", function (req, res) {
  const shortUrl = req.params.short_url;
  const originalUrl = urlDatabase[shortUrl];

  if (!originalUrl) {
    return res.status(404).json({ error: "URL not found" });
  }

  return res.redirect(originalUrl);
});

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});