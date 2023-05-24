const express = require("express");
const multer = require("multer");
const fs = require("fs");

const app = express();
const upload = multer({ dest: "uploads/" });
const { uploadFile } = require("./s3");
const { detectLabel } = require("./aws");

app.post("/upload", upload.single("file"), async (req, res) => {
  const file = req.file;
  console.log(file);
  // S3 upload
  const result = await uploadFile(file);
  fs.unlinkSync(file.path);
  console.log(result);
//   AWS Recognition
        const data=await detectLabel(result.Key);
        console.log(data.CustomLabels[0].Name);
    res.status(200).send(data.CustomLabels[0].Name);
//   res.status(200).send(result.Key);
});

app.listen(8000, () => console.log("liten on port 8000"));
