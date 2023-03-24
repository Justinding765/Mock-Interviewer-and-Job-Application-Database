


const express = require("express");
const app = express();

const mongoose = require("mongoose");
const multer = require("multer");
const {
  GridFsStorage
} = require("multer-gridfs-storage");

require("dotenv").config();

const mongouri =process.env.Mongo_URI
try {
  mongoose.connect(mongouri, {
    useUnifiedTopology: true,
    useNewUrlParser: true
  });
} catch (error) {
  handleError(error);
}
process.on('unhandledRejection', error => {
  console.log('unhandledRejection', error.message);
});

//creating bucket
let bucket;
mongoose.connection.on("connected", () => {
  var client = mongoose.connections[0].client;
  var db = mongoose.connections[0].db;
  bucket = new mongoose.mongo.GridFSBucket(db, {
    bucketName: "newBucket"
  });
  //console.log(bucket);
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use((req, res, next) =>{ 
    console.log(req.path)
    next()
})

const storage = new GridFsStorage({
  url: mongouri,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      // const data = JSON.parse((file.originalname))
      // console.log(data)
      const filename = file.originalname;
      const fileInfo = {
        filename: filename,
        bucketName: "newBucket",
      };
   
      resolve(fileInfo);
    });
  }

});

const upload = multer({
    storage,
})
app.get('/media/get_images', (req, res) => {
  bucket.find({ contentType: { $regex: 'image/' } }).toArray((err, files) => {
    if (!files || files.length === 0) {
      return res.status(404).json({ err: 'No images found' });
    }
    const filePromises = files.map((file) => {
      return new Promise((resolve, reject) => {
        const fileStream = bucket.openDownloadStreamByName(file.filename);

        fileStream.on('error', (err) => {
          console.error(err);
          reject('Failed to read image file');
        });

        const chunks = [];
        fileStream.on('data', (chunk) => {
          chunks.push(chunk);
        });

        fileStream.on('end', () => {
          const buffer = Buffer.concat(chunks);
          const dataUrl = `data:${file.contentType};base64,${buffer.toString('base64')}`;
          resolve({ filename: file.filename, dataUrl: dataUrl, date: file.uploadDate});
        });
      });
    });

    Promise.all(filePromises)
      .then((images) => {
        res.json(images);
      })
      .catch((err) => {
        res.status(500).json({ err: err });
      });
  });
});

app.get('/media/get_video/:filename', (req, res) => {
  console.log(req.params.filename,)
  const file = bucket
    .find({
      filename: req.params.filename,
    })
    .toArray((err, files) => {

      if (!files || files.length === 0) {
        return res.status(404)
          .json({
            err: "no files exist"
          });
        }
        //res.set('Content-Type', 'video/mp4');
        // res.set('Content-Length', files[0].length);
        // res.set('Content-Disposition', `attachment; filename="${files[0].filename}"`);
      bucket.openDownloadStreamByName(req.params.filename)
        .pipe(res);
    });
})






app.get("/fileinfo/:filename", (req, res) => {
  const file = bucket
    .find({
      filename: req.params.filename,
    })
    .toArray((err, files) => {

      if (!files || files.length === 0) {
        return res.status(404)
          .json({
            err: "no files exist"
          });
        }
        //res.set('Content-Type', 'video/mp4');
        // res.set('Content-Length', files[0].length);
        // res.set('Content-Disposition', `attachment; filename="${files[0].filename}"`);
      bucket.openDownloadStreamByName(req.params.filename)
        .pipe(res);
    });
});
app.post("/api/media/upload", upload.fields([{ name: 'video', maxCount: 1 }, { name: 'image', maxCount: 1 }]), (req, res) => {
    res.status(200).send("File uploaded successfully");
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Application live on localhost:${process.env.PORT}`);
});

process.env