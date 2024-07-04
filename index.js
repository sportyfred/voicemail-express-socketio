require('dotenv').config();

/* eslint-disable no-console */
const path = require('path');


const multer = require('multer');

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/');
  },
  filename(req, file, cb) {
    const fileNameArr = file.originalname.split('.');
    cb(null, `${Date.now()}.${fileNameArr[fileNameArr.length - 1]}`);
  },
});
const upload = multer({ storage });


   


const express = require('express')
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 3000;

var result = []
const tra = []
const { FileClient } = require('@vonage/server-client');
const fileClient = new FileClient({
     apiKey: process.env.API_KEY,
  apiSecret: process.env.API_SECRET,
  applicationId: process.env.APP_ID,
  privateKey: process.env.PRIVATE_KEY,
});

// Save the file to a specific location




const bodyParser = require('body-parser');
const uniqueName = require('unique-names-generator');

 const fs = require('fs')
 const rootDirectory = (__dirname + '/uploads')
const textDirectory = (__dirname + '/public/transcriptions')
    recursivelyReadDirectory = function (rootDirectory) {
        // TODO
    };



app.use(express.static('public'));
app.use(express.static('uploads'));
app.use(bodyParser.json());




app.post('/record', upload.single('audio'), (req, res) => res.json({ success: true }));

app.get('/recordings', (req, res) => {
  let files = fs.readdirSync(path.join(__dirname, 'uploads'));
  files = files.filter((file) => {
    // check that the files are audio files
    const fileNameArr = file.split('.');
    return fileNameArr[fileNameArr.length - 1] === 'webm';
  }).map((file) => `${file}`);
  io.emit('filename', files);
  return res.json({ success: true, files });
  
});




// answer calls to number linked to Nexmo app
app.get('/answer', (req, res) => {
  const ncco = [
    
     {
        "action": "stream",
        "streamUrl": [
            process.env.URL+"/water.wav"
        ]

    },
   
      {
    "action": "talk",
    "text": "Hej. Säg något om fred. Avsluta med fyrkant",
    "language": "sv-SE",
    "style": 5,
        "premium": true
  },
  
    {
      "action": "record",
      "eventUrl": [process.env.URL+"/voicemail"],
      "endOnKey": "#",
      "beepStart": "true",
 
       
    
    

    },
       {
    "action": "talk",
    "text": "Tack. pi is aut",
    "language": "sv-SE",
    "style": 5,
        "premium": true
  },
  ];
  res.send(ncco);
});



// events from Nexmo app
app.post('/event', (req, res) => {
  res.status(204);
  console.log(req.body);

  
});

// defined in `/answer`, called when recording completed
app.post('/voicemail', (req, res) => {
       console.log('start')

let path1 = path.join(__dirname, "/uploads/");
let date = Date.now();
let filename = path1 + date + '.webm';
console.log(filename); 
fileClient.downloadFile(
  req.body.recording_url, filename);
console.log('ues record');

     let files = fs.readdirSync(path.join(__dirname, 'uploads'));
  files = files.filter((file) => {
    // check that the files are audio files
    const fileNameArr = file.split('.');
    return fileNameArr[fileNameArr.length - 1] === 'webm';
  }).map((file) => `${file}`);
     io.emit('filename', files);
console.log(files);
});




io
    .on('connection', function (socket) {
         let files = fs.readdirSync(path.join(__dirname, 'uploads'));
  files = files.filter((file) => {
    // check that the files are audio files
    const fileNameArr = file.split('.');
    return fileNameArr[fileNameArr.length - 1] === 'webm';
  }).map((file) => `${file}`);


console.log(files)

            socket.emit('filename', files);
        }, function (err) {
            if (err) {
                socket.emit('error', 'Something went wrong');
            } else {
                socket.emit('done');
            }
        });

            

       
  

http.listen(port);