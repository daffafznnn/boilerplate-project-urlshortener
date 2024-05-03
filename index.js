require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/public", express.static(`${process.cwd()}/public`));

app.get("/", function (req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

// URL database
let urlDatabase = {};
let shortUrlCounter = 1;

// Your API endpoint to shorten URLs
app.post("/api/shorturl", function (req, res) {
  const originalUrl = req.body.url;

  // Check if the URL is valid
  const urlRegex = /^(ftp|http|https):\/\/[^ "]+$/;
  if (!urlRegex.test(originalUrl)) {
    res.json({ error: "invalid url" });
    return;
  }

  // Generate short URL
  const shortUrl = shortUrlCounter++;
  urlDatabase[shortUrl] = originalUrl;

  // Return response
  res.json({ original_url: originalUrl, short_url: shortUrl });
});

// Redirect to original URL
app.get("/api/shorturl/:short_url", function (req, res) {
  const shortUrl = req.params.short_url;
  const originalUrl = urlDatabase[shortUrl];

  if (!originalUrl) {
    res.status(404).json({ error: "URL not found" });
    return;
  }

  res.redirect(originalUrl);
});

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
