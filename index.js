require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const dns = require("dns");
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;
let urlDatabase = [];
let nextShortUrl = 1;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: "false" }));
app.use("/public", express.static(`${process.cwd()}/public`));

app.get("/", function (req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

// Your first API endpoint
app.get("/api/hello", function (req, res) {
  res.json({ greeting: "hello API" });
});

// POST URL to shorten
app.post("/api/shorturl", function (req, res) {
  const originalUrl = req.body.url;
  const urlPattern = /^(http|https):\/\/[^ "]+$/;

  if (!urlPattern.test(originalUrl)) {
    res.json({ error: "invalid url" });
    return;
  }

  // Check if URL is valid
  const urlObj = new URL(originalUrl);
  dns.lookup(urlObj.hostname, (err) => {
    if (err) {
      res.json({ error: "invalid url" });
      return;
    }

    // Save URL to database
    urlDatabase.push({ original_url: originalUrl, short_url: nextShortUrl });
    const shortUrl = nextShortUrl++;

    res.json({
      original_url: originalUrl,
      short_url: shortUrl,
    });
  });
});

// Redirect short URL to original URL
app.get("/api/shorturl/:short_url", function (req, res) {
  const shortUrl = parseInt(req.params.short_url);

  const foundURL = urlDatabase.find((url) => url.short_url === shortUrl);
  if (!foundURL) {
    res.json({ error: "short url not found" });
    return;
  }

  res.redirect(foundURL.original_url);
});

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
