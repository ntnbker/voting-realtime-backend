var _ = require('lodash');
var controllerPath = __base + 'controllers/';

var roundCtrl = require(controllerPath + 'round');
var inviteeCtrl = require(controllerPath + 'invitee');
var routes = [
  {
    path: '/auth/local',
    method: 'POST',
    middlewares: [function(req, res, next) {
      req.auth = {
        strategy: 'local'
      };
      next();
    }],
    noAuth: true
  },
  {
    path: '/round',
    method: 'POST',
    middlewares: [roundCtrl.nextRound],
    noAuth: true
  },
  {
    path: '/round/vote',
    method: 'POST',
    middlewares: [function(req, res, next) {
      req.vote = true;
      return next();
    }, inviteeCtrl.attachInvitee, roundCtrl.voting],
    noAuth: true
  },
  {
    path: '/round',
    method: 'GET',
    middlewares: [roundCtrl.getResult],
    noAuth: true
  },{
    path: '/invitee',
    method: 'POST',
    middlewares: [inviteeCtrl.registerInvitee],
    noAuth: true
  },{
    path: '/invitee',
    method: 'GET',
    middlewares: [inviteeCtrl.getListInvitee],
    noAuth: true
  },{
    path: '/invitee',
    method: 'DELETE',
    middlewares: [inviteeCtrl.deactive],
    noAuth: true
  },{
    path: '/invitee/login',
    method: 'GET',
    middlewares: [inviteeCtrl.login],
    noAuth: true
  },{
    path: '/round/revoting',
    method: 'POST',
    middlewares: [function(req, res, next) {
      req.vote = false;
      return next();
    }, roundCtrl.voting],
    noAuth: true
  },
]

module.exports = function(app) {
  // for (var i in routes) {
  //   if (!routes[i].noAuth) routes[i].middlewares.unshift(middleware.userAuth);
  // }
  for (var i in routes) {
    applyRoute(app, routes[i]);
  }
}

function applyRoute(app, route) {
  console.log('APPLY ROUTE', route);
  var args = _.flatten([route.path, route.middlewares]);
  switch (route.method.toUpperCase()) {
      case 'GET':
          app.get.apply(app, args);
          break;
      case 'POST':
          app.post.apply(app, args);
          break;
      case 'PUT':
          app.put.apply(app, args);
          break;
      case 'DELETE':
          app.delete.apply(app, args);
          break;
      default:
          throw new Error('Invalid HTTP method specified for route ' + route.path);
          break;
  }
}
