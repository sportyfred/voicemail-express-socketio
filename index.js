require('dotenv').config();


   


const express = require('express')
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);



const bodyParser = require('body-parser');
const uniqueName = require('unique-names-generator');

 const fs = require('fs')
 const rootDirectory = (__dirname + '/public/recordings')

    recursivelyReadDirectory = function (rootDirectory) {
        // TODO
    };

const Nexmo = require('nexmo');
const nexmo = new Nexmo({
  apiKey: process.env.API_KEY,
  apiSecret: process.env.API_SECRET,
  applicationId: process.env.APP_ID,
  privateKey: __dirname + '/' + process.env.PRIVATE_KEY
});


app.use(express.static('public'));
app.use(bodyParser.json());

// answer calls to number linked to Nexmo app
app.get('/answer', (req, res) => {
  const ncco = [
    
     {
        "action": "stream",
        "streamUrl": [
            "https://a311-81-233-8-75.ngrok-free.app/water.wav"
        ]
    },
    {
      action: 'talk',
      voiceName: 'Ivy',
      text: 'Hey say now got ohm Fred. Press # to end.'
    },
    {
      action: 'record',
      eventUrl: [process.env.URL + '/voicemail'],
      endOnKey: '#',
      beepStart: true,
     "transcription":
        {
            "eventMethod": "POST",
            "eventUrl":[process.env.URL + '/transcription'],
            "language": "sv-SE",
            "sentimentAnalysis": "true"
        }
    

    },
    {
      action: 'talk',
      voiceName: 'Ivy',
      text: 'Tack, goodbye.'
    }
  ];
  res.send(ncco);
});

// events from Nexmo app
app.post('/event', (req, res) => {
  res.status(204);
});

// defined in `/answer`, called when recording completed
app.post('/voicemail', (req, res) => {
  let filename = uniqueName.uniqueNamesGenerator() + '.mp3';
  let path = __dirname + '/public/recordings/' + filename;
  nexmo.files.save(req.body.recording_url, path, (err, response) => {
    if (err) {
      res.status(500);
      return console.error(err);
    }
    io.emit('voicemail', {
      date: req.body.start_time,
      file: filename
    });
  });
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
console.log(split[1]);
            socket.emit('filename', split[1]);
        }, function (err) {
            if (err) {
                socket.emit('error', 'Something went wrong');
            } else {
                socket.emit('done');
            }
        });
    });

http.listen(3000);