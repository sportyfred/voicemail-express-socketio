/* eslint-disable no-console */
/* eslint-disable no-alert */
/* eslint-disable no-restricted-globals */
// initialize elements we'll use
const recordButton = document.getElementById('recordButton');
const recordButtonImage = recordButton.firstElementChild;
const recordedAudioContainer = document.getElementById('recordedAudioContainer');
const saveAudioButton = document.getElementById('saveButton');
const discardAudioButton = document.getElementById('discardButton');
const recordingsContainer = document.getElementById('recordings');

let chunks = []; // will be used later to record audio
let mediaRecorder = null; // will be used later to record audio
let audioBlob = null; // the blob that will hold the recorded audio

function mediaRecorderDataAvailable(e) {
  chunks.push(e.data);
}

function mediaRecorderStop() {
  // check if there are any previous recordings and remove them
  if (recordedAudioContainer.firstElementChild.tagName === 'AUDIO') {
    recordedAudioContainer.firstElementChild.remove();
  }
  const audioElm = document.createElement('audio');
  audioElm.setAttribute('controls', ''); // add controls
  audioBlob = new Blob(chunks, { type: 'audio/webm' });
  const audioURL = window.URL.createObjectURL(audioBlob);
  audioElm.src = audioURL;
  // show audio
  recordedAudioContainer.insertBefore(audioElm, recordedAudioContainer.firstElementChild);
  recordedAudioContainer.classList.add('d-flex');
  recordedAudioContainer.classList.remove('d-none');
  // reset to default
  mediaRecorder = null;
  chunks = [];
}

function record() {
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    alert('Your browser does not support recording!');
    return;
  }

  // browser supports getUserMedia
  // change image in button
  recordButtonImage.src = `/img/${mediaRecorder && mediaRecorder.state === 'recording' ? 'microphone' : 'stop'}.png`;
  if (!mediaRecorder) {
    // start recording
    navigator.mediaDevices.getUserMedia({
      audio: true,
    })
      .then((stream) => {
        mediaRecorder = new MediaRecorder(stream);
        mediaRecorder.start();
        mediaRecorder.ondataavailable = mediaRecorderDataAvailable;
        mediaRecorder.onstop = mediaRecorderStop;
      })
      .catch((err) => {
        alert(`The following error occurred: ${err}`);
        // change image in button
        recordButtonImage.src = '/img/microphone.png';
      });
  } else {
    // stop recording
    mediaRecorder.stop();
  }
}

recordButton.addEventListener('click', record);

function resetRecording() {
  if (recordedAudioContainer.firstElementChild.tagName === 'AUDIO') {
    recordedAudioContainer.firstElementChild.remove();
    // hide recordedAudioContainer
    recordedAudioContainer.classList.add('d-none');
    recordedAudioContainer.classList.remove('d-flex');
  }
  audioBlob = null;
}

function playRecording(e) {
  let button = e.target;
  if (button.tagName === 'IMG') {
    // get parent button
    button = button.parentElement;
  }
  const audio = button.previousElementSibling;
  if (audio && audio.tagName === 'AUDIO') {
    if (audio.paused) {
      audio.play();
      button.firstElementChild.src = '/img/pause.png';
    } else {
      audio.pause();
      button.firstElementChild.src = '/img/play.png';
    }
  }
}

function createRecordingElement(file) {
  const recordingElement = document.createElement('div');
  recordingElement.classList.add('col-lg-2', 'col', 'recording', 'mt-3');
  const audio = document.createElement('audio');
  audio.src = file;
  audio.onended = (e) => {
    e.target.nextElementSibling.firstElementChild.src = '/img/play.png';
  };
  recordingElement.appendChild(audio);
  const playButton = document.createElement('button');
  playButton.classList.add('play-button', 'btn', 'border', 'shadow-sm', 'text-center', 'd-block', 'mx-auto');
  const playImage = document.createElement('img');
  playImage.src = '/img/play.png';
  playImage.classList.add('img-fluid');
  playButton.appendChild(playImage);
  playButton.addEventListener('click', playRecording);
  recordingElement.appendChild(playButton);
  const download = document.createElement('a');
  download.setAttribute('class', 'signature');
download.setAttribute('href', audio.src);
const downloadname = audio.src.split('/');
download.textContent = 'Ladda ner';

download.setAttribute ('download', downloadname[1]);



 recordingElement.appendChild(download);
  return recordingElement;
}

// fetch recordings
function fetchRecordings() {
  fetch('/recordings')
    .then((response) => response.json())
    .then((response) => {
      if (response.success && response.files) {
        recordingsContainer.innerHTML = ''; // remove all children
        response.files.forEach((file) => {
          const recordingElement = createRecordingElement(file);
          // console.log(file, recordingElement);
          recordingsContainer.appendChild(recordingElement);
        });
      }
    })
    .catch((err) => console.error(err));
}

function saveRecording() {
  const formData = new FormData();
  formData.append('audio', audioBlob, 'recording.webm');
  fetch('/record', {
    method: 'POST',
    body: formData,
  })
    .then((response) => response.json())
    .then(() => {
      alert('Din röst är skickad');
      resetRecording();
      fetchRecordings();
    })
    .catch((err) => {
      console.error(err);
      alert('Det blev fel');
      resetRecording();
    });
}

saveAudioButton.addEventListener('click', saveRecording);

function discardRecording() {
  if (confirm('Är du säker du vill slänga inspelningen?')) {
    // discard audio just recorded
    resetRecording();
  }
}

discardAudioButton.addEventListener('click', discardRecording);

fetchRecordings();
