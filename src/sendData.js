var https = require('https');
var Q = require('q');

function sendData(temp, humid, callback) {
  var deferred = Q.defer();

  var payload = {
    temperature: temp,
    humidity: humid,
    time: Date.now()
  };

  var options = {
    host: 'homethermostat.firebaseio.com',
    path: '/zee.json',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  };

  var req = https.request(options, function(res) {
    res.setEncoding('utf8');
    res.on('data', deferred.resolve);
  });

  req.on('error', deferred.reject);

  req.write(JSON.stringify(payload));

  req.end();

  return deferred.promise;
}

module.exports = sendData;