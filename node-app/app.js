const express = require("express");
const sequelize = require("./util/database");
const bodyParser = require("body-parser");
const adminRoutes = require("./routes/admin");
const userRoutes = require("./routes/user");
const fs = require("fs/promises");
const path = require("path");
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "UPDATE, POST, GET, PUT, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.use("/images", express.static(path.join(__dirname, "images")));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(null, uuidv4() + "." + file.mimetype.split("/")[1]);
  },
});

const fileFilter = (req, file, cb) => {
  const fileType = file.mimetype;
  if (
    fileType === "image/png" ||
    fileType === "image/jpeg" ||
    fileType === "image/jpg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

app.use(
  multer({ storage: storage, fileFilter: fileFilter }).single("user_image")
);

app.use("/admin", adminRoutes);
app.use("/user", userRoutes);

app.use((error, req, res, next) => {
  const statusCode = error.statusCode || 500;
  res.status(statusCode).json({ message: error.message, state: -1 });
});

sequelize
  .sync()
  .then((result) => {
    console.log("connected ...");
    app.listen(process.env.PORT || 4000);
  })
  .catch((err) => {
    console.log(err);
  });
