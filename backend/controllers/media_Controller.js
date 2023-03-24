const Video = require('../models/videoModel')
const mongoose = require('mongoose')
const multer = require("multer");

const {
    GridFsStorage
  } = require("multer-gridfs-storage");
let bucket;
mongoose.connection.on("connected", () => {
    var client = mongoose.connections[0].client;
    var db = mongoose.connections[0].db;
    bucket = new mongoose.mongo.GridFSBucket(db, {
        bucketName: "newBucket"
});
//console.log(bucket);
});
const mongouri =process.env.Mongo_URI
const storage = new GridFsStorage({
    url: mongouri,
    file: (req, file) => {
      return new Promise((resolve, reject) => {
        // const data = JSON.parse((file.originalname))
        // console.log(data)
        const filename = file.originalname;
        console.log(file)
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

const media_upload = async(req,res) =>{

    const{name,type,size,data} = req.body
    //convert_to_mp4(req.body.data)
    try{
        const video = await Video.create({name,type,size,data})
        console.log(name)

        res.status(200).json(video)
    } catch(error){
        console.log(error.message)
        res.status(400).json({error:error.message})

    }
    //res.json({mssg: 'POST a new video'})
}
const get_images = (req,res) =>{
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
  };
const get_videos = () =>{

}


module.exports = {
    media_upload,
    get_images,
    get_videos,
    upload

}
process.env