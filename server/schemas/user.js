var db = require('./db');
var UserMysql = (function(){

  function UserMysql(){
    this.table_name = 'gbm_user';
  }
 
  UserMysql.prototype = { 
    // user search by user_id and current session
    find : function(userId,sessionId,_callback){ 
      db.query("SELECT * FROM "+this.table_name+" WHERE current_session = ? and id = ?;",[sessionId,userId], _callback); 
    }
    // get user by username
    , get : function(username,_callback){ 
      db.query("SELECT * FROM "+this.table_name+" WHERE username = ? ;",[username], _callback); 
    }
    // log user replacing the current session
    , signin : function(userId,sessionId,_callback){ 
      db.query("UPDATE "+this.table_name+" SET current_session = ? WHERE id = ?;",[sessionId,userId], _callback); 
    } 
      // create new user on the database
    , create : function(User,_callback){ 
      db.query("INSERT INTO "+this.table_name+" SET ?", User,_callback); 
    } 
  }
  // Expõe o construtor 
  return UserMysql;

}()); 

var User = new UserMysql;
module.exports =  User;