const fs = require("fs");
const path = require("path");

export default function handler(req, res) {
  try {
    const currentUrl = req.headers.referer;
    const parts = currentUrl.split("/");
    const id = parts[parts.length - 1];
    const imageDataURL = req.body;
    const imageBuffer = Buffer.from(imageDataURL.split(",")[1], "base64");
    fs.writeFileSync(path.resolve(`public/ogp/${id}.png`), imageBuffer);
    res.status(200).json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error });
  }
}
