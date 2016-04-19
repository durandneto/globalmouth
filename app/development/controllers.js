exports.NavBarController = function($scope, $user) {
  $scope.user = $user;
  setTimeout(function() {
    $scope.$emit('NavBarController');
  }, 0);
};
 
exports.ModalRewardsController = function($scope, $mdDialog) {
  
  $scope.hideModalRewards = function(){
    $mdDialog.hide();
  }
  
  setTimeout(function(){
    $scope.$emit('ModalRewardsController');
  }, 0);
}
exports.IndexController = function($scope, $user, $mdMedia, $mdDialog, $mdToast) {
  // setting time of the match
  $scope.time = 0;

    // verify if has a user on browser
  $user.load(function(status,user){
    if(status){
      $scope.user = user;
      $scope.current_session = user.data.current_session;
      // start user logged verification 
      $scope.verifySession();
    }else{
      $user.logout();
      $scope.user = null;
      $scope.current_session = null;
    }
    $scope.loader = false;
  });

  $scope.startMatch = function(){
    // call api start match
    $user.startMatch(function(status,match){
      if(status){
        // startmatch sucess
        // emulate fake goal in ramdom times
        $scope.fakeGoals(match.data.matches);
        // start the game progress
        $scope.runMatch(function(){
          // send to view the user's point
          $scope.user.data.points += match.data.rewards;
          $scope.$digest();
          // open modal rewards
          $scope.openModalRewards(match.data.rewards);
        });
      }else{
        alert('error refresh this page');
      }
    });
  };

  $scope.openModalRewards = function(points){
    $user.load(function(status,user){
      if(status){
        $scope.user = user;
        $scope.current_session = user.data.current_session;
        // start user logged verification 
        $scope.verifySession();
      }else{
        $user.logout();
        $scope.user = null;
        $scope.current_session = null;
      }
      $scope.loader = false;
    });

    // set points on modal scope
    $scope.points = points;

    var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && $scope.customFullscreen;
    $mdDialog.show({
      parent: angular.element(document.body),
      clickOutsideToClose:false,
      fullscreen: useFullScreen,
      scope:$scope,
      preserveScope: true,
      template: "<modal-rewards points={{points}}></modal-rewards>",
    })
    .then(function() {

      $mdDialog.show(
        $mdDialog.alert()
          .clickOutsideToClose(false)
          .title('Congratulations')
          .textContent('Rewards collected sucessfully')
          .ariaLabel('Alert Dialog Demo')
          .ok('Start New Round!')
      );
    }, function() {

    });
    // get media query in realtime
    $scope.$watch(function() {
      return $mdMedia('xs') || $mdMedia('sm');
    }, function(wantsFullScreen) {
      $scope.customFullscreen = (wantsFullScreen === true);
    });
  }

  // simulate match the same "elifoot game"
  $scope.fakeGoals = function(match){
    for(var index_match in match){
      for (var i = 0; i < match[index_match].team_home_goal; i++) {
          $user.setGoalHome(index_match); 
          $scope.$digest();
      }
      for (var i = 0; i < match[index_match].team_challenger_goal; i++) {
          $user.setGoalChallenger(index_match); 
          $scope.$digest();
      }
    }
  };
  // simulation of a soccer match with 90 minutes duration and 15 minute half time
  $scope.runMatch = function(_callback){ 
    $scope.time += 1;
    setTimeout(function(){
      switch(true){
        case ($scope.time < 45):
          $scope.runMatch(_callback);
          $scope.$digest();
          break;
        case ($scope.time == 45):
          $scope.message_match = ' Half-time break ';
          $scope.$digest();
          setTimeout(function(){
            $scope.message_match = ' Replacement players ';
            $scope.$digest();
          },1000);
          setTimeout(function(){
            $scope.runMatch(_callback);
            $scope.message_match = '';
            $scope.$digest();
          },3000);
          break;
        case ($scope.time < 90):
          $scope.runMatch(_callback);
          $scope.$digest();
          break;
        case ($scope.time == 90):
          $scope.time = 0;
          _callback();
          $scope.$digest();
          break;
      }
    },100);
  }
  // send to server the user's choice on the match id
  $scope.bet = function(match,bet){
    match.user_bet = bet;
    $user.bet({match_id:match.match_id,bet:bet},function(status,response){
      
    }); 
  };

  // function tha send to api, the username to login and create new championship
  $scope.login = function(){
    $scope.loadding = true;
    $user.signin($scope.form,function(status,user){
      $scope.loadding = false;
      if(status){
        $scope.user = user;
        $scope.current_session = user.data.current_session;
        $scope.verifySession();
      }else{
        $scope.error = user.error;
      }
    }); 
  };
  // verify user's session and if not the same of the session, call function logout the current user
  $scope.verifySession = function(){
    $user.getCurrentUser(function(user){
      if($scope.current_session == user.current_session){
        setTimeout(function() {
          $scope.verifySession();
        }, 1000);  
      }else{
        $scope.user = null;
        $scope.$digest();
        try{
          $mdDialog.cancel();
        }catch(err){

        }
      }
    });
  }
  
  $scope.logout = function(){
    $user.logout(function(){
      $scope.user = null;
    });
  }

  setTimeout(function() {
    $scope.$emit('IndexController');
  }, 0);
};