var _ = require('underscore');

module.exports = function(wagner) { 

  var User =require('./schemas/user');
  var Championship =require('./schemas/championship');
   
  var models = {
    User: User
    , Championship: Championship
  };

  //Record all mysql models to use the api
  _.each(models, function(value, key) {
    wagner.factory(key, function() {
      return value;
    });
  });
 

  return models;
};
