var fs = require('fs');

module.exports = function(wagner) {
  //the Config options
  wagner.factory('Config', function() {
    return JSON.parse(fs.readFileSync('./config/config.json').toString());
  });
};
