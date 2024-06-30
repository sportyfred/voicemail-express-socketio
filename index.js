require('dotenv').config();



   


const express = require('express')
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 3000;

var result = []
const tra = []
const trans ={
  "ver": "1.0.19",
  "request_id": "6226182254ce513117079b58",
  "channels": [
    {
      "transcript": [
        {
          "sentence": "fred example test.",
          "timestamp": 9630,
          "duration": 2642,
          "action_items": [],
          "questions": [],
          "answers": [],
          "raw_sentence": "fred är en känsla",
          "words": [
            {
              "word": "transcription",
              "start_time": 9630,
              "end_time": 10887,
              "confidence": 1
            },
            {
              "word": "example",
              "start_time": 10952,
              "end_time": 11726,
              "confidence": 0.990055
            },
            {
              "word": "test",
              "start_time": 11728,
              "end_time": 12272,
              "confidence": 0.486845
            }
          ],
          "sentiments": [
            {
              "text_part": "transcription example test",
              "score": 0.1213
            }
          ]
        },
        {
          "sentence": "muy bien master.",
          "timestamp": 9630,
          "duration": 2642,
          "action_items": [],
          "questions": [],
          "answers": [],
          "raw_sentence": "jag och du och fred",
          "words": [
            {
              "word": "transcription",
              "start_time": 9630,
              "end_time": 10887,
              "confidence": 1
            },
            {
              "word": "example",
              "start_time": 10952,
              "end_time": 11726,
              "confidence": 0.990055
            },
            {
              "word": "test",
              "start_time": 11728,
              "end_time": 12272,
              "confidence": 0.486845
            }
          ],
          "sentiments": [
            {
              "text_part": "transcription example test",
              "score": 0.1213
            }
          ]
        }
      ],
      "duration": 16.2
    }
  ]}



const bodyParser = require('body-parser');
const uniqueName = require('unique-names-generator');

 const fs = require('fs')
 const rootDirectory = (__dirname + '/app/public/recordings')
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
app.use(bodyParser.json());

// answer calls to number linked to Nexmo app
app.get('/answer', (req, res) => {
  const ncco = [
    
     {
        "action": "stream",
        "streamUrl": [
            "https://voicemail-express-socketio-production.up.railway.app/water.wav"
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
      action: 'record',
      eventUrl: ['https://voicemail-express-socketio-production.up.railway.app/voicemail'],
      endOnKey: '#',
      beepStart: true,
     "transcription":
        {
            
        
            "language": "sv-SE",
            "sentimentAnalysis": "true"
        }
    

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
  console.log(req.body.transcription_url);
});

// defined in `/answer`, called when recording completed
app.post('/voicemail', (req, res) => {
  console.log('voicemail'+req.body);
  let filename = req.body.start_time + '.mp3';
  let path = __dirname + '/public/recordings/' + filename;
  console.log('path'+path);
  nexmo.files.save(req.body.recording_url, path, (err, response) => {
    if (err) {
      res.status(500);
      return console.error(err);
    }
    return console.log('success write file')
  });

    io.emit('voicemail', filename);
    io.emit('vm', req.body);
});

// defined in `/answer`, called when recording completed
app.post('/transcription', (req, res) => {
  console.log('transcription:'+req.body);

   let tfilename = uniqueName.uniqueNamesGenerator() + '.json';


fs.writeFile('./public/transcriptions/'+tfilename, JSON.stringify(req.body, null, 2), (error) => {
  if (error) {
    console.log('An error has occurred ', error);
    return;
  }
  console.log('JSON written successfully to disk');
});


const meningar2 = []

var array2 = req.body;

for (i in array2['channels'][0]['transcript']){
meningar2[i] = (array2['channels'][0]['transcript'][i]['raw_sentence'])


        }
        console.log(meningar2)
    io.emit('textfilename2',meningar2)
  
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
const split = text.split("recordings/");

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

var array = JSON.parse(fs.readFileSync(__dirname + '/public/transcriptions/'+split[1], 'utf8'));

for (i in array['channels'][0]['transcript']){
meningar[i] = (array['channels'][0]['transcript'][i]['raw_sentence'])


        }
        console.log(meningar)
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