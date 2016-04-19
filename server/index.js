var express = require('express');
var wagner = require('wagner-core');

require('./models')(wagner);
require('./config/dependencies')(wagner);

var app = express();
// sets the cors api to be accessed by others servers
app.use(function(req, res, next) {
  res.append('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.append('Access-Control-Allow-Credentials', 'true');
  res.append('Access-Control-Allow-Methods', ['GET', 'OPTIONS', 'PUT', 'POST']);
  res.append('Access-Control-Allow-Headers','Origin, X-Requested-With, Content-Type, Accept');
  res.append('Access-Control-Allow-Headers','Authorization');
  next();
});
// set the api to use  /api/v1/* on the all requests
app.use('/api/v1', require('./api')(wagner,app));
app.listen(3000);

console.log('Listening on port 3000!');