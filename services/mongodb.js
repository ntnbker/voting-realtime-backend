var fs = require('fs');
var path = require('path');
var mongoose = require('mongoose');

var config = require(__base + 'config/config');

// Go through each model file and load it.
mongoose.init = function() {
  var modelsPath = __base + 'services';
  console.log(modelsPath);
  fs.readdirSync(modelsPath).forEach(function (file) {
    if (/(.*)\.(js$|coffee$)/.test(file) && file != 'mongodb.js') {
      require(modelsPath + '/' + file);
      console.log('Model found: ' + file);
    }
  });
}

module.exports = mongoose;
