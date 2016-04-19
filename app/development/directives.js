exports.navBar = function() {
  return {
    controller: 'NavBarController'
    , templateUrl: './templates/nav-bar/nav_bar.html'
  };
};
exports.home = function() {
  return {
    controller: 'IndexController'
    , templateUrl: './templates/home/home.html'
  };
};
exports.userFormLogin = function() {
  return {
    templateUrl: './templates/home/user-form-login.html'
  };
};
exports.playerStats = function() {
  return {
    templateUrl: './templates/home/player-stats.html'
  };
}; 
exports.userPoll = function() {
  return {
    templateUrl: './templates/home/user-poll.html'
  };
};
exports.loader = function() {
  return {
    templateUrl: './templates/loader/loader.html'
  };
};
exports.currentMatch = function() {
  return {
    templateUrl: './templates/home/current-match.html'
  };
};
exports.currentChampionship = function() {
  return {
    templateUrl: './templates/home/current-championship.html'
  };
};
exports.modalRewards = function() {
  return {
    scope: {
      points: "@points",
    }
    , controller : 'ModalRewardsController'
    , templateUrl: './templates/modal/rewards.html'
  };
};