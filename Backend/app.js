const bodyParser = require("body-parser");
const express = require("express");
require("dotenv").config();

const placesRoutes = require("./routes/places-routes");
const usersRoutes = require("./routes/users-routes");
const HttpError = require("./models/http-error");

const app = express();

app.use(bodyParser.json());

app.get("/", (req, res) => {
  const indexFile = fs.readFileSync(
    path.join(__dirname, "public", "index.html"),
    "utf8"
  );
  const updatedIndexFile = indexFile.replace(
    "GOOGLE_MAPS_API_KEY",
    process.env.GOOGLE_MAPS_API_KEY
  );
  res.send(updatedIndexFile);
});

app.use("/api/places", placesRoutes);

app.use("/api/users", usersRoutes);

app.use((req, res, next) => {
  const error = new HttpError("Page not found.", 404);
  return next(error);
});

app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || "An unknown error occurred." });
});

app.listen(5000);
