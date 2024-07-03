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




const bodyParser = require('body-parser');
const uniqueName = require('unique-names-generator');

 const fs = require('fs')
 const rootDirectory = (__dirname + '/uploads')
const textDirectory = (__dirname + '/public/transcriptions')
    recursivelyReadDirectory = function (rootDirectory) {
        // TODO
    };

const Nexmo = require('nexmo');
const nexmo = new Nexmo({
  apiKey: process.env.API_KEY,
  apiSecret: process.env.API_SECRET,
  applicationId: process.env.APP_ID,
  privateKey: process.env.PRIVATE_KEY
});



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
  }).map((file) => `/${file}`);
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

  
});

// defined in `/answer`, called when recording completed
app.post('/voicemail', (req, res) => {
 
  let filename = uniqueName.uniqueNamesGenerator() + '.webm';
  let path = __dirname + '/uploads/' + filename;
  consolg.log(path);
 upload.single(req.body.recording_url, 'recording.webm');
  nexmo.files.save(req.body.recording_url, path, (err, response) => {
    if (err) {
      res.status(500);
      return console.error(err);
    }
    return console.log('success write file')
  });

    io.emit('voicemail', filename);

});



var walk = function (dir, action, done) {

    // this flag will indicate if an error occured (in this case we don't want to go on walking the tree)
    var dead = false;

    // this flag will store the number of pending async operations
    var pending = 0;

    var fail = function (err) {
        if (!dead) {
            dead = true;
            done(err);
        }
    };

    var checkSuccess = function () {
        if (!dead && pending == 0) {
            done();
        }
    };

    var performAction = function (file, stat) {
        if (!dead) {
            try {
                action(file, stat);
            }
            catch (error) {
                fail(error);
            }
        }
    };

    // this function will recursively explore one directory in the context defined by the variables above
    var dive = function (dir) {
        pending++; // async operation starting after this line
        fs.readdir(dir, function (err, list) {
            if (!dead) { // if we are already dead, we don't do anything
                if (err) {
                    fail(err); // if an error occured, let's fail
                }
                else { // iterate over the files
                    list.forEach(function (file) {
                        if (!dead) { // if we are already dead, we don't do anything
                            var path = dir + "/" + file;
                            pending++; // async operation starting after this line
                            fs.stat(path, function (err, stat) {
                                if (!dead) { // if we are already dead, we don't do anything
                                    if (err) {
                                        fail(err); // if an error occured, let's fail
                                    }
                                    else {
                                        if (stat && stat.isDirectory()) {
                                            dive(path); // it's a directory, let's explore recursively
                                        }
                                        else {
                                            performAction(path, stat); // it's not a directory, just perform the action
                                        }
                                        pending--;
                                        checkSuccess(); // async operation complete
                                    }
                                }
                            });
                        }
                    });
                    pending--;
                    checkSuccess(); // async operation complete
                }
            }
        });
    };

    // start exploration
    dive(dir);
};

io
    .on('connection', function (socket) {
        walk(rootDirectory, function (path, stat) {
            
            let text = path;
const split = text.split("uploads/");

            socket.emit('filename', split[1]);
        }, function (err) {
            if (err) {
                socket.emit('error', 'Something went wrong');
            } else {
                socket.emit('done');
            }
        });

             walk(textDirectory, function (path, stat) {
            
            let text = path;


const split = text.split("transcriptions/");
const meningar = []

var array = JSON.parse(fs.readFileSync('./public/transcriptions/'+split[1], 'utf8'));

for (i in array['channels'][0]['transcript']){
meningar[i] = (array['channels'][0]['transcript'][i]['raw_sentence'])


        }
   
    socket.emit('textfilename',meningar)
}, function (err) {
            if (err) {
                socket.emit('error', 'Something went wrong');
            } else {
                socket.emit('done');
            }
        });

       
    });

http.listen(port);