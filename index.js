require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json()); // Middleware untuk mengurai data JSON dalam permintaan
app.use("/public", express.static(`${process.cwd()}/public`));
app.use(express.urlencoded({ extended: true }));

app.get("/", function (req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

// Your first API endpoint
app.get("/api/hello", function (req, res) {
  res.json({ greeting: "hello API" });
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
    return res.status(400).json({ error: "invalid url" });
  }

  // Generate short URL
  const shortUrl = shortUrlCounter++;
  urlDatabase[shortUrl] = originalUrl;

  // Return response with original_url and short_url properties
  return res.json({ original_url: originalUrl, short_url: shortUrl });
});

// Redirect to original URL
app.get("/api/shorturl/:short_url", function (req, res) {
  const shortUrl = req.params.short_url;
  const originalUrl = urlDatabase[shortUrl];

  if (!originalUrl) {
    return res.status(404).json({ error: "URL not found" });
  }

  return res.redirect(301, originalUrl); // Gunakan status 301 untuk permanent redirect
});

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
