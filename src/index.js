var tessel = require('tessel');
var climatelib = require('climate-si7020');
var sendData = require('./sendData');

var climate = climatelib.use(tessel.port['A']);

climate.on('ready', function () {

  setImmediate(function loop() {
    climate.readTemperature('c', function (err, temp) {
      climate.readHumidity(function (err, humid) {
        console.log('Degrees:', temp.toFixed(4) + 'C', 'Humidity:', humid.toFixed(4) + '%RH');
        sendData(temp, humid).then(function requestDone() {
          setTimeout(loop, 5000);
        }, function requestFail(e) {
          setTimeout(loop, 5000);
          console.log(e);
        });
      });
    });
  });

});

climate.on('error', function(err) {
  console.log('error connecting module', err);
});