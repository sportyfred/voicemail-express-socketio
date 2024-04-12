require('dotenv').config();

const express = require('express')
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

const bodyParser = require('body-parser');
const uniqueName = require('unique-names-generator');

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
    /*
     {
        "action": "stream",
        "streamUrl": [
            "https://a311-81-233-8-75.ngrok-free.app/water.wav"
        ]
    },*/
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
  let path = __dirname + '/public/' + filename;
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

http.listen(3000);