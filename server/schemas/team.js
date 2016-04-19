var db = require('./db');
var TeamMysql = (function(){

  function TeamMysql(){
    this.table_name = 'gbm_team';
    this.teams;
  }
 
  TeamMysql.prototype = {
    // shuflles teams
    getRamdom  : function(_callback) {
      var array = this.teams; 
      for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp; 
      }
      _callback(array)
    }
    // find all user 
    , findAll  : function(_callback) {
      if(this.teams != undefined){
        // teams exits
        this.getRamdom(_callback);
      }else{
        // no have teams yet
        var _this = this;
        db.query("select * from "+this.table_name+";", function(err,row,fields){
          _this.teams = row;
          _this.getRamdom(_callback);
        }); 
      }
    }
  }
  return TeamMysql;
}()); 

var Team = new TeamMysql;
module.exports =  Team;