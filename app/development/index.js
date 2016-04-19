var controllers = require('./controllers');
var directives = require('./directives');
var services = require('./services');
var _ = require('underscore');

var components = angular.module('globalmouth-app.components', ['ng']);
// load all controllers
_.each(controllers, function(controller, name) {
  components.controller(name, controller);
});
// load all directives
_.each(directives, function(directive, name) {
  components.directive(name, directive);
});
// load all services
_.each(services, function(factory, name) {
  components.factory(name, factory);
});

var app = angular.module('globalmouth-app', ['globalmouth-app.components', 'ui.router','ngMaterial']);

app.config(function($stateProvider, $urlRouterProvider) { 

  $urlRouterProvider.otherwise("/"); 
      // Now set up the states
  $stateProvider
    .state('app', {
      url: "/",
      template: '<home></home>' 
    })

});
app.config(function($mdThemingProvider) {
  $mdThemingProvider.theme('default')
    .primaryPalette('pink', {
      'default': '400', // by default use shade 400 from the pink palette for primary intentions
      'hue-1': '100', // use shade 100 for the <code>md-hue-1</code> class
      'hue-2': '600', // use shade 600 for the <code>md-hue-2</code> class
      'hue-3': 'A100' // use shade A100 for the <code>md-hue-3</code> class
    })
    // If you specify less than all of the keys, it will inherit from the
    // default shades
    .accentPalette('purple', {
      'default': '200' // use shade 200 for default, and keep all other shades the same
    });
});