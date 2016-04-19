var mysql = require("mysql");

// create a connection to the db
var db = mysql.createConnection({
  host: "mysql.reboquerecife.com.br",
  user: "reboquerecife03",
  password: "durand123",
   database : 'reboquerecife03',
   port : 3306
});

module.exports = db;