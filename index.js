require('dotenv').config();

let urlParse = require('url');

const {parse} = require('querystring');

/* eslint-disable no-console */
const path = require('path');


const multer = require('multer');

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/');
  },
  filename(req, file, cb) {
    const fileNameArr = file.originalname.split('.');
    const fname = new Date().toJSON().replace(/:/g, "-").replace(/T/g, "_").replace(".", "-").slice(0,23);
const fnameweb = fname + '_web';   
    cb(null, `${fnameweb}.${fileNameArr[fileNameArr.length - 1]}`);

  const inputPath = `${rootDirectory}`+'/'+fnameweb+'.webm';
const outputPath = `${rootDirectory}`+'/'+fnameweb+'.wav';


ffmpeg()
  .input(inputPath)

  .output(outputPath)
  .on('end', () => {
    console.log('DASH encoding complete.');
  })
  .on('error', (err) => {
    console.error('Error:', err.message);
  })
  .run();


  },
});
const upload = multer({ storage });





const express = require('express')
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = 3000;

var result = []
const tra = []
const { FileClient } = require('@vonage/server-client');
const fileClient = new FileClient({
     apiKey: 6340ee83,
  apiSecret: jmbE7ckZRR1nMwsC,
  applicationId: 94194fbb-b43f-413b-b547-38daff4f80f7,
  privateKey: -----BEGIN PRIVATE KEY-----
MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCVRY9b+l+ex+TG
0VqKDXq3rk96KDlL9zFU/TuYABXm06PKAnqk8l9COgPkkXDQlkZUUXXE4rb6GTHk
+kzfL+hQ9Y/2OXWjkItoN2o8eiXAK5rvTCyalFsaz6ChIMk+VM0+envyqyyq9Fc4
zGJEkhxNnnp49uxjc4cTTavt2qn1FamnFySaW8w6cwcLSt7zgBVY+y2fI0gFm3gU
sBRaGfd+0vY9+SkNajjIS90jJ4LOCJsbNOrnTHYqE/rZpxoM5P8lMf+8M1m7cLtJ
6HTb1fBxBPZZ+pNjRcJgOgeVS3oNLhgd6mhEjYoKPg8qtZuAn0d7YiGLzP6HvK2n
asyCSH1lAgMBAAECggEABesVtzZC4RWL1iL2zZwIAY0nsyNlIiq3o5ozgqzkl88Z
Io+pzS01TN4ZljZhNePymRhuhh/dbiarLVwlloCPwj+TzzwrLd3NQse8e1yPopux
lbGveXGB+AFdA2zWJ2KCJx5nS6r9wMlvRXeh1C/DoraZCuXykv7bNcJRzsLP4Ker
t9TL3W112OYAvyHY9XW9XTrtcPi8vEQjzIZBmHDg//sJoAFourY4R+E7oLA7Gkmc
wNjyfdo0q8ZPQhLm7ESeg4hiw2GrpBnMHmFsRMP4yeoBzohbbqIMHx/P8GRyvHPm
cLr+O4BymOEMJJxeaoa+Dz/vEJU6n9Zy9hzUHEWwAQKBgQDG0zMK/gSkzId9Qo8B
23rryCPBml4KzRV589gJt0gvDE/v1fjKAMxO1Ic5J+PuN9OApIhJ2XB3PAg4mF6s
pIs26McvxyrDAIEpbGwrtk1sU6lIwqsta4KSe6g9lqIUSO0HL7UWlzq45oIcr0dw
51wPawNiu+ziRjWQL8mcwICWEQKBgQDAMmvu1HxZPwnMvwUnuUB4Z/wz/TnMzoGS
jjK1pCbr/P2qNHiTIsoSfn7vdQ0jUGIfvQx1MS4IbejwFtLkCABxrd2UybhKfyEL
syqG9edWm9JThyz/clX9VYWV9HTBGz7jtLAPxqzbQVNpukbGSzKcC4YBSIQ1SzII
DWduOtNOFQKBgQCmbuzvaqvgeAWC6VBksaE39hVYXywRxpMPvvs9Rtt55siTb34P
OpPL+UQoqCe4paq6qQAdMZNffDU1ivbVdffDQyBZ8lLtYWK9ljEGdlhhMbcnXS2F
m9V1YWX4CDws1s7zkQ/5lSZm2S5ZbLBU5pa9oUr4P2+QCk2UISyXttzswQKBgARs
5MlSAS744ZviRhcdD9v14Pu9d+g8VQVv2sEN74t9fsW9gY05vtdgLEINOuk2P5wl
eTT1le7BwRxOGjr/6Cq16yUy49hrRvKDBJao8NOwsM4VjbawBkTYBERopYuQugj6
Lxed5nsB7Q7BKEIGlzq6lTJQXiLwAU3oKRqDpjvlAoGAX1LkiCKkZ2dx/uRIXCJI
y6GcdUVqcLwDRTK82ng2+er2eML0o0AHecfNL6Ti9sqstnJNe+PQtccMotrSdIRr
6bdWabEzBfjIPkZs3NdgXE3KmbYw8MZyFQcVUZlxuTWF+ZQbjd0N9WQzHVkf3cXF
8Yh+3Aw+mAtCTlncAMLMMTo=
-----END PRIVATE KEY-----
,
});

// Save the file to a specific location




const bodyParser = require('body-parser');
const uniqueName = require('unique-names-generator');

 const fs = require('fs')
 const rootDirectory = (__dirname + '/uploads')
  const rootDirectory2 = (__dirname + '/uploads/' + 'test.webm')
  const rootDirectory3 = (__dirname + '/uploads/' + 'test.wav')
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

    return fileNameArr[fileNameArr.length - 1] === 'wav';
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
            "https://main-bvxea6i-stnoijo6q4cgm.eu-5.platformsh.site/water.wav"
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
      "eventUrl": ["https://main-bvxea6i-stnoijo6q4cgm.eu-5.platformsh.site/voicemail"],
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





const ffmpegStatic = require('ffmpeg-static');
const ffmpeg = require('fluent-ffmpeg');

ffmpeg.setFfmpegPath(ffmpegStatic);




// defined in `/answer`, called when recording completed
app.post('/voicemail', (req, res) => {



let path1 = path.join(__dirname, "/uploads/");

let date = new Date().toJSON().replace(/:/g, "-").replace(/T/g, "_").replace(".", "-").slice(0,23);

let filename = path1 + date + '_telefon.wav';
console.log(filename); 
fileClient.downloadFile(
  req.body.recording_url, filename);
console.log('ues record');

     let files = fs.readdirSync(path.join(__dirname, 'uploads'));
  files = files.filter((file) => {
    // check that the files are audio files
    const fileNameArr = file.split('.');
    return fileNameArr[fileNameArr.length - 1] === 'wav';
  }).map((file) => `${file}`);
     io.emit('filename', files);

});




io
    .on('connection', function (socket) {
console.log('a user connected');
        socket.on('login', (data) => {
if (data === 'Kebab123') {
 console.log('login great: ' + data);
 let files = fs.readdirSync(path.join(__dirname, 'uploads'));
        
  files = files.filter((file) => {
    // check that the files are audio files
    const fileNameArr = file.split('.');
    return fileNameArr[fileNameArr.length - 1] === 'wav';
  }).map((file) => `${file}`);




            socket.emit('filename', files);
 }
 else {
       console.log('login no : ' + data);
 }

         
        });
         
        }, function (err) {
            if (err) {
                socket.emit('error', 'Something went wrong');
            } else {
                socket.emit('done');
            }
        });

            

       
  

http.listen(port);