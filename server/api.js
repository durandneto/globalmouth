var bodyparser = require('body-parser');
var express = require('express');
var status = require('http-status');
var _ = require('underscore');
var jwt = require('jwt-simple');
var moment = require('moment');
var slugify = require('slugify');

module.exports = function(wagner,app) {

  var api = express.Router();

  api.use(bodyparser.json());

  /**
  * @description: This function has as objective, 
    to verify if the User is registered in the database, 
    if not registered this function will be responsible 
    for registers it and create a championship for the User 
    to be displayed in the homepage, if the User exists, 
    it retrieves the User and the current championship status.
  * @params: username string name or email of the user
  * @return: Object {
        User :{
          username : String 
          , current_session : String identify the browser or browser tab with user request de login
          , access_token : String JWT token with user authenticated
        }
        , championship : {
            data : championship info and list of matches 
        }
      }
  * @developer : Durand Neto
  */
  
  api.post('/user/signin', wagner.invoke(function(User, Championship, Config) {
    return function(req, res) {
      var expires = moment().add(7,'days').valueOf(); 
      var session_id =  Math.random();
      User.get(req.body.username,function(err,row,fields){
        try{
          if(row.length == 0){
            // create a new user
            var newUser = Config.UserSchema;
            newUser.username = req.body.username;
            newUser.current_session = session_id;
            User.create(newUser,function(err,rowUser,fields){
              if(err){
                renderFail(res,err,status.INTERNAL_SERVER_ERROR);
              }else{
                // get the user's championship
                Championship.getChampionship(rowUser.insertId, function(err,championshiprow,fields){
                  var token = jwt.encode({
                    user_id: rowUser.insertId,
                    session_id : session_id,
                    championship_id: championshiprow[0].championship_id,
                    exp: expires
                  }, Config.jwtTokenSecret);
   
                  var ruser_resposnse = {
                    username : req.body.username
                    , current_session : session_id
                    , access_token : token
                  }
                  render(res,{user:ruser_resposnse,championship:championshiprow});
                });
              }
            });
          }else{
            // found user
            var user = row[0]; 
            User.signin(user.id,session_id,function(err,rowSignin,fields){
              if (err) {
                renderFail(res,err,status.NOT_FOUND);
              }
              // get the user's championship
              Championship.getChampionship(user.id, function(err,championshiprow,fields){
                var token = jwt.encode({
                  user_id: user.id,
                  championship_id: championshiprow[0].championship_id,
                  session_id : session_id,
                  exp: expires
                }, Config.jwtTokenSecret);

                user.expires = expires;
                user.access_token = token;
                
                render(res,{user:user,championship:championshiprow});
              });
            });

          }

        }catch(err){
          renderFail(res,'Username not found '+err,status.NOT_FOUND);
        }
      });
    };
  }));
 

   /**
  * @description: This function to save the database which was the bet of 
    the User, the User can choose from 'HOME' for the winner to be the home team, 
    'DRAW' a tie and 'CHALLENGER' if the winner is the challenger.
  * @params: match_id int identify the row on database to set the uset bet
  * @params: bet String parameters that user choose on the home page
  * @return: Object {
        data : success
      }
  * @developer : Durand Neto
  */
  api.post('/user/bet', wagner.invoke(function( Championship,Config) {
    return function(req, res) {
      try {
        if(req.body.match_id == undefined || req.body.bet == undefined){
          renderFail(res,'Params not found',status.INTERNAL_SERVER_ERROR);
        }else{
          var token = req.headers['authorization'].split('Bearer ')
          var decoded = jwt.decode(token[1], Config.jwtTokenSecret);
          // set user choice on the match
          Championship.updateMatchUserBet(decoded.championship_id,req.body.match_id,req.body.bet,function(err,row,fields){
            if(err){
              renderFail(res,err,status.INTERNAL_SERVER_ERROR);
            }else{
              render(res,{});
            }
          });
        }
      }catch(err){
        renderFail(res,err,status.NOT_FOUND);
      }
    };
  }));
   /**
  * @description: This function handles the league matches current user, 
    this function solves all the scores and calculate how many times you had 
    successes and also what reward the User will receive
  * @params: match_id int identify the row on database to set the uset bet
  * @return: Object {
        matches : list of matches revolved,
      }
  * @developer : Durand Neto
  */
  api.post('/user/start-match', wagner.invoke(function(Championship,Config) {
    return function(req, res) {
      try {
        var token = req.headers['authorization'].split('Bearer ')
        var decoded = jwt.decode(token[1], Config.jwtTokenSecret);
        // load the user's championship
        Championship.find(decoded.championship_id,function(err,row,fields){
          var returnMatch = {};
            // set rwards default
            returnMatch.rewards = 0;
            // set the match default
            returnMatch.matches  = [];
          for (var match in row) {
            //calculate the possible goals that team can do
            var team_match_goal = Math.floor(Math.random() * (row[match].team_home_max_goal - 0));
            var team_challenger_goal = Math.floor(Math.random() * (row[match].team_challenger_max_goal - 0));
            // add match to response
            returnMatch.matches.push({
              match_id:row[match].match_id
              , team_home_goal :team_match_goal
              , team_challenger_goal :team_challenger_goal
            });
            // save choice on the database
            Championship.updateMatchGoal(row[match].match_id,team_match_goal,team_challenger_goal);
          }
          // get all rewards from this championship
          Championship.getRewards(decoded.championship_id,function(err,rowRewards,fields){
            // finish the round
            Championship.finish(decoded.championship_id,(rowRewards[0].rewards*100),function(err,rowFinish,fields){
              // add rewards to response
              returnMatch.rewards = (rowRewards[0].rewards*100);
              render(res,returnMatch);
            });
          });
        });
      }catch(err){
        renderFail(res,err,status.NOT_FOUND);
      }
    };
  }));
   /**
  * @description: this function is called when the User does 
    refresh the page and retona the same login function
  * @params: void
  * @return: Object {}
  * @developer : Durand Neto
  */
  api.get('/user/me', wagner.invoke(function(User, Championship,Config) {
    return function(req, res) {
      try {

      var token = req.headers['authorization'].split('Bearer ')
      var decoded = jwt.decode(token[1], Config.jwtTokenSecret);
      // search user
      User.find(decoded.user_id,decoded.session_id,function(err,row,fields){
        if(row != undefined && row.length > 0){
          var session =  Math.random();
          var expires = moment().add(7,'days').valueOf(); 
          var user = row[0];
          User.signin(user.id,session,function(err,row,fields){
            if (err) {
              renderFail(res,err,status.NOT_FOUND);
            }
            // get user's championship
            Championship.getChampionship(user.id, function(err,championshiprow,fields){
               var token = jwt.encode({
                user_id: user.id,
                session_id : session,
                championship_id: championshiprow[0].championship_id,
                exp: expires
              }, Config.jwtTokenSecret);

              user.expires = expires;
              user.access_token = token;
              render(res,{user:user,championship:championshiprow});
            });
            
          });
        }else{
          renderFail(res,'User not found',status.NOT_FOUND);
        }
      });

      }catch(err){
        renderFail(res,'User not found '+ err,status.NOT_FOUND);
      }
    };



  })); 
   

  return api;
};
   /**
  * @description: this function is called when api render the success response
  * @params: res api response
  * @params: data Object
  * @return: Object {}
  * @developer : Durand Neto
  */
function render(res,data){ 
  return res.json({status:'success', data: data });
}
/**
  * @description: this function is called when api render the fail response
  * @params: res api response
  * @params: data Object
  * @return: Object {}
  * @developer : Durand Neto
  */
function renderFail(res,error,status){
  return res.
    status(status).
    json({ status:'fail', error:  error });
}
/**
  * @description: This function is called to pick up where the User is in session
  * @params: req api response
  * @params: data Object
  * @return: Object {}
  * @developer : Durand Neto
  */
function getUserSession(req,Config){
   try {
      var token = req.headers['authorization'].split('Bearer ')
      , decoded = jwt.decode(token[1], Config.jwtTokenSecret);
      return decoded;
   }catch(err){
          renderFail(res,err,status.INTERNAL_SERVER_ERROR);
        } 
}

 




