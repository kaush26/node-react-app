const fs = require("fs/promises");
const path = require("path");

module.exports = clearImage = (fileName) => {
  const filePath = path.join(__dirname, "../", fileName);
  console.log(filePath);
  fs.unlink(filePath)
    .then((result) => {
      console.log(" 👍 Image cleared successfully!");
    })
    .catch((err) => {
      console.log(err);
    });
};
