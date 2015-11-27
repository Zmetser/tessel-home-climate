module.exports = function writeLog(message) {
  if (typeof message === 'object') {
    message = JSON.stringify(message, null, '\t');
  }
  process.sendfile('error_' + Date.now() + '.log', message);
}