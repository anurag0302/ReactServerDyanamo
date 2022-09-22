const { v4: uuidv4 } = require("uuid");
const multer = require("multer");
app.use("/profile", express.static("upload"));
const path = require("path");


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      const value = "upload/";
      cb(null, value);
    },
    filename: (req, file, cb) => {
      cb(
        null,
        `${file.fieldname}_${uuidv4()}${path.extname(
          file.originalname.toLowerCase()
        )}`
      );
    },
  });
  export const upload = multer({ storage: storage }).single("image");