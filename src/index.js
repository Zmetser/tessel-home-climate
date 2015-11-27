var tessel = require('tessel');
var climatelib = require('climate-si7020');

var writeLog = require('./writeLog');
var sendData = require('./sendData')(process.argv[3]);

var climate = climatelib.use(tessel.port['A']);

var processingLEDBlink;
var idleLED = tessel.led[0];
var processingLED = tessel.led[1];
var errorLED = tessel.led[2];

var idleTime = !isNaN(parseInt(process.argv[2], 10)) ? parseInt(process.argv[2], 10) : 5000;
var debugMode = process.argv[4] === 'debug';

function loop() {
  idleLED.write(false);
  processingLED.write(true);

  climate.readTemperature('c', function (err, temp) {
    climate.readHumidity(function (err, humid) {
      (function blink(value) {
        processingLED.write(value);
        processingLEDBlink = setTimeout(blink, 200, !value);
      })(true);

      sendData(temp, humid).then(requestDone, requestFail);
    });
  });
}

function requestDone(response) {
  var data = {};

  stopProcessingLED();

  try {
    data = JSON.parse(response);
  } catch (e) {
    handleError(e);
  }

  if (!data.name) {
    handleError(response);
  }

  startLoop();
}

function requestFail(err) {
  handleError(err);

  stopProcessingLED();
  startLoop();
}

function startLoop() {
  idleLED.write(true);
  setTimeout(loop, idleTime);
}

function stopProcessingLED() {
  clearTimeout(processingLEDBlink);
  processingLED.write(false);
}

function handleError(message) {
  errorLED.write(true);
  writeLog(response);
}

climate.on('ready', function () {

  setImmediate(loop);

});

climate.on('error', function(err) {
  (function blink (value) {
    errorLED.write(value);
    setTimeout(blink, 200, !value);
  })(true);

  writeLog(err);
});

// Turn off all status leds
idleLED.write(false);
processingLED.write(false);
errorLED.write(false);