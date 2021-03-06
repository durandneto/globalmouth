var status = require('http-status'); 

exports.$user = function($globalMouthApi,$globalMouthStorage) {
// local user
var u = {};
  u.data = [];

  /**
  * @description: This function load user from api
  * @params: {void}
  * @return: {function}
  * @developer : Durand Neto
  */
  function load(_callback) {
    //get the user from api
    $globalMouthApi.get('/user/me', function(status,response){
      if(status){
        // set user on localstorage
        $globalMouthStorage.setObject('user',response.data.user);
        // set user on local variable
        u.data = response.data.user;
        // set championship on local variable
        u.championship = response.data.championship;
        // call function callback
        _callback(status,u);
      }else{
        // reset user data
        u.data = [];
        _callback(status,response);
      }
    });
  }; 
  /**
  * @description:  This function get current user from localstorage
  * @params: callback function function will be executed when get current user
  * @return: call function callback
  * @developer : Durand Neto
  */
  function getCurrentUser(_callback) {
    $globalMouthStorage.getObject('user',_callback);
  };
  /**
  * @description:  This function increment goal on the team home on the match
  * @params: index int position where increment goal
  * @return: void
  * @developer : Durand Neto
  */
  function setGoalHome(index) {
    setTimeout(function(){
      u.championship[index].team_home_goals += 1;
    }, Math.floor(Math.random() * (9000 + 1)));
  };
  /**
  * @description:  This function increment goal on the team challenger on the match
  * @params: index int position where increment goal
  * @return: void
  * @developer : Durand Neto
  */
  function setGoalChallenger(index) {
    setTimeout(function(){
      u.championship[index].team_challenger_goals += 1;
    }, Math.floor(Math.random() * (9000 + 1)));
  }; 

  /**
  * @description: This function logout user
  * @params: callback function function will be executed when logout
  * @return: void
  * @developer : Durand Neto
  */
  function logout(_callback) {
    $globalMouthStorage.remove('user');
    u = {};
    if(_callback != undefined){
      _callback();
    }
  }; 
  /**
  * @description: This function send to api the user bet
  * @params: bodyPatams Object object with match_id and user_bet
  * @params: callback function function will be executed when logout
  * @return: void
  * @developer : Durand Neto
  */
  function bet(bodyParams,_callback) {
    $globalMouthApi.post('/user/bet',bodyParams,function(status,response){
      _callback(status,response);
    });
  };
  /**
  * @description: This function send to api start match
  * @params: callback function function will be executed when logout
  * @return: void
  * @developer : Durand Neto
  */
  function startMatch(_callback) {
    $globalMouthApi.post('/user/start-match',{},function(status,response){
      _callback(status,response);
    });
  };
  /**
  * @description: This function login user on the api
  * @params: form Object object with username
  * @params: callback function function will be executed when logout
  * @return: void
  * @developer : Durand Neto
  */
  function signin(form,_callback) {
  /*TODO*/
    $globalMouthApi.post('/user/signin',{username:form.username},function(status,response){
      if(status){
        $globalMouthStorage.setObject('user',response.data.user);
        u.data = response.data.user;
        u.championship = response.data.championship;
        _callback(true,u);
      } else{
        _callback(false,response);
      }
    });
  };

  return {
    load : load
    , getCurrentUser : getCurrentUser
    , signin : signin
    , logout : logout
    , startMatch : startMatch
    , setGoalHome : setGoalHome
    , setGoalChallenger : setGoalChallenger
    , bet : bet
  };

};

exports.$globalMouthApi = function($window,$http,$timeout,$globalMouthStorage) {
  
  var api = 'http://localhost:3000/api/v1';

  return {
    /**
    * @description: This function send to api a request type POST and execute a callback
    * @params: url String endpoint
    * @params: params Object object to send de endpoint
    * @params: callback function function will be executed when logout
    * @return: void
    * @developer : Durand Neto
    */
    post : function(url, params, _callback) {
      var user = $globalMouthStorage.getObject('user');
      
      if(user != undefined){
        // exist a user logged and interate the request header with user's info
        $http.defaults.headers.common.Authorization = 'Bearer ' + user.access_token;
      }

      $http.post( api + url ,params)
      .success(function (response) {
          $timeout(function(){
              _callback(true,response);
          });
      })
      .error(function(response){
          $timeout(function(){
              _callback(false,response);
          });
      });
    }
     /**
    * @description: This function send to api a request type GET and execute a callback
    * @params: url String endpoint
    * @params: callback function function will be executed when logout
    * @return: void
    * @developer : Durand Neto
    */
    , get : function(url, _callback) {
      var user = $globalMouthStorage.getObject('user');
      
      if(user != undefined){
        $http.defaults.headers.common.Authorization = 'Bearer ' + user.access_token;
      }
      $http.get( api + url )
      .success(function (response) {
        $timeout(function(){
            _callback(true,response);
        });
      })
      .error(function(response){
        $timeout(function(){
            _callback(false,response);
        });
      });
    }
     /**
    * @description: This function send to api a request type DELETE and execute a callback
    * @params: url String endpoint
    * @params: callback function function will be executed when logout
    * @return: void
    * @developer : Durand Neto
    */
    , delete : function(url, _callback) {
      /*TODO*/
    }
     /**
    * @description: This function send to api a request type PATCH and execute a callback
    * @params: url String endpoint
    * @params: callback function function will be executed when logout
    * @return: void
    * @developer : Durand Neto
    */
    , patch : function(url,params , _callback) {
      /*TODO*/
    }
     /**
    * @description: This function send to api a request type PUT and execute a callback
    * @params: url String endpoint
    * @params: callback function function will be executed when logout
    * @return: void
    * @developer : Durand Neto
    */
    , put : function(url,params , _callback) {
      /*TODO*/
    }
  }

};

exports.$globalMouthStorage = function($window) {

  return {
    remove: function(key, value) {
      $window.localStorage.removeItem(key);
    },
    set: function(key, value) {
      $window.localStorage[key] = value;
    },
    get: function(key, defaultValue) {
      return $window.localStorage[key] || defaultValue;
    },
    setObject: function(key, value) {
      $window.localStorage[key] = JSON.stringify(value);
    },
    getObject: function(key,_callback) {
      try{
        var obj = JSON.parse($window.localStorage[key] || null);
        if(_callback != undefined){
          _callback(obj);
        }else{
          return obj;
        }
      }catch(error){
        return null;
      }
    }
  }

};