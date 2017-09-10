var mongodb = __mongodb;
var Invitee = mongodb.model('invitee');
var async = require('async');

function handleErrorDatabase(err, res) {
  console.error(err);
  res.status(400).send('Database Error');
}

exports.registerInvitee = function(req, res, next) {
  var params = Object.assign(req.body, req.params, req.query);
  Invitee.create(params, function(err, newInvitee) {
    if (err) {
      return handleErrorDatabase(err, res);
    }
    return res.status(200).send(newInvitee);
  });
}

exports.attachInvitee = function(req, res, next) {
  var params = Object.assign(req.body, req.query, req.params);
  var id = params.id;
  Invitee
    .find({
      _id: id,
      isActive: true,
    })
    .limit(1)
    .exec(function(err, invitees) {
      if (err) {
        return handleErrorDatabase(err, res);
      }
      if (!invitees || invitees.length === 0) {
        return res.status(404).send('Invitee Not Found');
      }
      if (!req.body) req.body = {};
      req.body.invitee = invitees[0];
      return next();
    })
}

exports.getListInvitee = function(req, res, next) {
  Invitee.find({
    isActive: true,
  }, function(err, invitees) {
    if (err) {
      return handleErrorDatabase(err, res);
    }
    return res.status(200).send(invitees);
  })
}

exports.deactive = function(req, res, next) {
  var conditions = Object.assign(req.body, req.params, req.query);
  Invitee.find(conditions, function(err, invitees) {
    if (err || invitees.length === 0) {
      console.error(err || 'Not Found');
      return res.status(400).send(err || 'Not Found')
    }
    async.forEach(invitees, function(item, callback) {
      Invitee.findOneAndUpdate({
        _id: item._id,
      }, {
        $set: {
          isActive: false,
        }
      }, callback)
    }, function(err) {
      if (err) {
        return handleErrorDatabase(err, res);
      }
      var listInvitees = invitees.map(function(invitee) {
        return invitee.name;
      }).join(', ');
      return res.status(200).send('Had deactived ' + listInvitees);
    })
  })
}
