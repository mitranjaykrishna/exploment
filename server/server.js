const express = require("express");
const multer = require("multer");
const fs = require("fs");
const PORT=process.env.PORT||8000

const app = express();
const upload = multer({ dest: "uploads/" });
const { uploadFile } = require("./s3");
const { detectLabel } = require("./aws");
if(process.env.NODE_ENV==='production'){
  app.use(express.static('../client/build'))
}

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

app.listen(PORT, () => console.log(`liSten on port ${PORT}`));
