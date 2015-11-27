var tessel = require('tessel');
var climatelib = require('climate-si7020');

var writeLog = require('./writeLog');
var sendData = require('./sendData');

var climate = climatelib.use(tessel.port['A']);

function loop() {
  climate.readTemperature('c', function (err, temp) {
    climate.readHumidity(function (err, humid) {
      sendData(temp, humid).then(requestDone, requestFail);
    });
  });
}

function requestDone(response) {
  var data;

  try {
    data = JSON.parse(response);
  } catch (e) {
    writeLog(response);
  }

  if (!data.name) writeLog(response);

  setTimeout(loop, 5000);
}

function requestFail(err) {
  writeLog(err);
  setTimeout(loop, 5000);
}

climate.on('ready', function () {

  setImmediate(loop);

});

climate.on('error', function(err) {
  writeLog(err);
});