var https = require('https');
var Q = require('q');
var config = require('../config');

module.exports = function (path) {
  return function sendData(temp, humid, callback) {
    var deferred = Q.defer();

    var payload = {
      temperature: temp,
      humidity: humid,
      timestamp: Date.now()
    };

    var options = {
      host: config.firebase.projectName + '.firebaseio.com',
      path: path,
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
  };
}