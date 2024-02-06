const fs = require("fs");
const htmlFilePath = "public/index.html";

// Read the HTML file
let htmlContent = fs.readFileSync(htmlFilePath, { encoding: "utf8" });

// Replace the placeholder with the actual environment variable
htmlContent = htmlContent.replace(
  "GOOGLE_MAPS_API_KEY",
  process.env.GOOGLE_MAPS_API_KEY
);

// Write the modified HTML back to the file
fs.writeFileSync(htmlFilePath, htmlContent);

console.log("API key was injected successfully.");
