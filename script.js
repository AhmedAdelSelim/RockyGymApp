const fs = require("fs");
const path = require("path");

const directoryPath = path.join(__dirname, "assets/images/body");

fs.readdir(directoryPath, (err, files) => {
  if (err) {
    return console.log("Unable to scan directory: " + err);
  }
  console.log(files);
});
