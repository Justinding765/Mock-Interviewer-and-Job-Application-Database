const express = require("express");
const app = express();

const mongoose = require("mongoose");
const multer = require("multer");
const {
  GridFsStorage
} = require("multer-gridfs-storage");
require("dotenv").config();
const mongouri =process.env.Mongo_URI
const workoutRoutes = require('./routes/workouts')
const applications = require('./routes/applications')
// const mediaRoutes = require('./routes/media')
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
});



//middleware
    // checks for every request of there's some body to the request that we are sending to the server
    // If there it is passes it and attaches it to req object. Useful for post requests in workouts.js, 
    //as we can access the data through req.body there
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use((req, res, next) =>{ 
    console.log(req.path)
    next()
})
//routes
app.use('/api/applications', applications)
//app.use('/api/workouts', workoutRoutes)

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
//Should change in the future to get ids, so that we can refernce the images by id and
// not have to worry about duplicates. The associated videos have -1 diff in id
app.get('/api/media/get_images', (req, res) => {
  bucket.find({ contentType: { $regex: 'image/' } }).sort({ uploadDate: -1 }).toArray((err, files) => {
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

app.get('/api/media/get_video:filename', (req, res) => {
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
app.delete('/api/media/delete_video/:filename', (req, res) => {

  const filename = req.params.filename;
  Promise.all([
    bucket.find({ filename: filename }).toArray(), // find first file by name
    bucket.find({ filename: filename + '-video' }).toArray(), // find second file by name
  ])
  .then(([file1, file2]) => {
    const id1 = file1[0]._id;
    const id2 = file2[0]._id;
    console.log(file1)
    Promise.all([
      bucket.delete(id1),
      bucket.delete(id2)
    ])
    .then(() => res.json(200))
    .catch((err) => {
      console.error(err);
      res.status(500).send("An error occurred while deleting files.");
    });
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send("An error occurred while finding files to delete.");

  })
})

app.post("/api/media/upload", upload.fields([{ name: 'video', maxCount: 1 }, { name: 'image', maxCount: 1 }]), (req, res) => {
  res.status(200).send("File uploaded successfully");
});

//connect to db
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Application live on localhost:${process.env.PORT}`);
});
process.env
