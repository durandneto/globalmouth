var db = require('./db');
var Team =require('./team');

var ChampionshipMysql = (function(){

  function ChampionshipMysql(){
    this.table_name = 'gbm_championship';
    this.Teams = Team; 
  }
 
  ChampionshipMysql.prototype = {
    // create new championship if not have a current championship opened
    // if the user has a current championship opened, return current championship
    createChampionship  : function(userId,_callback) {
       db.query("call p_verify_championship("+userId+");",_callback);
    }
    // get user's championship
    , getChampionship : function(userId,_callback) {
        this.createChampionship(userId,function(err,row,fields){
          db.query("select gbm_team_home_goals team_home_goals,gbm_team_challenger_goals team_challenger_goals, m.id match_id , c.id championship_id , team_home.name team_home_name , team_home.cover_src team_home_cover_src , team_challenger.name team_challenger_name , team_challenger.cover_src team_challenger_cover_src , user_bet , c.name championship_name from gbm_championship_match m inner join gbm_championship c on c.id = gbm_championship_id inner join gbm_team team_home on team_home.id = m.gbm_team_home_id inner join gbm_team team_challenger on team_challenger.id = m.gbm_team_challenger_id where c.state = 'OPENED' and c.gbm_user_id = ? ;",userId,_callback); 
        });
    }
    // get user's championship
    , find : function(championshipId,_callback) {
      db.query("select m.id match_id ,team_home.max_goal_number team_home_max_goal,team_challenger.max_goal_number team_challenger_max_goal, team_home.name team_home_name , team_home.cover_src team_home_cover_src , team_challenger.name team_challenger_name , team_challenger.cover_src team_challenger_cover_src , user_bet , c.name championship_name from gbm_championship_match m inner join gbm_championship c on c.id = gbm_championship_id inner join gbm_team team_home on team_home.id = m.gbm_team_home_id inner join gbm_team team_challenger on team_challenger.id = m.gbm_team_challenger_id where c.id = ? ;",championshipId,_callback); 
    }
    // set team goal on the match
    , updateMatchGoal : function(matchId,teamHomeMatchGoal,teamChallengerMatchGoal){ 
      db.query("update gbm_championship_match set gbm_team_home_goals = ? , gbm_team_challenger_goals = ? where id = ?;",[teamHomeMatchGoal,teamChallengerMatchGoal,matchId]); 
    }
    // set user bet 
    , updateMatchUserBet : function(championshipId,matchId,bet,_callback){ 
      db.query("update gbm_championship_match set user_bet = ? where id = ? and gbm_championship_id = ?;",[bet,matchId,championshipId],_callback); 
    } 
    // close current championship and set user's point
    , finish : function(championshipId,points,_callback){ 
      db.query("update gbm_championship c inner join gbm_user u on u.id = c.gbm_user_id set c.state = 'FINISHED',u.points = u.points + ? where c.id = ?;",[points,championshipId],_callback); 
    }
    // get rewards by championship id
    , getRewards : function(championshipId,_callback){ 
      db.query("select rewards("+championshipId+") rewards ; ",_callback); 
    }
  }
  return ChampionshipMysql;
}()); 

var Championship = new ChampionshipMysql;
module.exports =  Championship;