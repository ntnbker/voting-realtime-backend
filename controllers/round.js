var mongodb = __mongodb;
var Round = mongodb.model('round');
var async = require('async');

var TIME_EACH_ROUND = 60 * 1000;

var listOfResponse = [];

function createNewRound(params, callback) {
  params.startTime = params.startTime || Date.now();
  params.endTime = params.endTime || Date.now() + TIME_EACH_ROUND;
  params.name = params.name || 'Example';
  params.votes = params.votes || [];
  isActive = true;

  findLastRound(function(err, round) {
    if (err || round.length === 0) {
      console.log(err || 'Nothing');
    }
    else {
      Round.findOneAndUpdate({
        _id: round._id
      }, {
        $set: {
          isActive: false,
        }
      })
    }

    Round.create(params, callback);
  })
}

function findLastRound(callback) {
  Round
    .find()
    .sort({endTime: -1})
    .limit(1)
    .exec(callback)
}

exports.nextRound = function(req, res, next) {
  const params = Object.assign(req.params, req.body, req.query);
  createNewRound(params, function(err, newRound) {
    if (err) {
      console.error(err);
      return res.status(400).send(err);
    }
    return res.status(200).send(newRound);
  })
}

function voting(params, callback) {
  findLastRound(function(err, round) {
    if (err || round.length === 0) {
      console.error(err);
      return callback('Not Found');
    }
    var isExist = false;
    var invitee = params.invitee;
    round[0].votes.forEach(function(vote) {
      if (isExist) return;
      if (vote.inviteeId === invitee._id) isExist = true;
    })
    if (isExist) return callback('Account had voted');
    Round.findOneAndUpdate({
      _id: round[0]._id,
    }, {
      $push: {
        votes: {
          name: invitee.name,
          inviteeId: invitee._id,
          answer: params.answer,
          votedTime: Date.now(),
        },
      },
      $set: {
        lastUpdatedTime: Date.now(),
      }
    }, {
      new: true,
    }, callback);
  });
}

function reVoting(id, callback) {
  findLastRound(function(err, round) {
    if (err || !round || round.length === 0) {
      console.error(err || 'Not Found');
      return res.status(400).send(err || 'Round Not Found');
    }

    var votes = round[0].votes.map(function(vote) {
      vote.answer = vote.inviteeId === id ? 'voted' : 'unvoted';
      return vote;
    });
    Round.findOneAndUpdate({
      _id: round[0]._id,
    }, {
      $set: {
        votes: votes,
        lastUpdatedTime: Date.now(),
      }
    }, {
      new: true,
    }, callback)
  })
}

exports.voting = function(req, res, next) {
  var params       = req.vote === true
                      ? Object.assign(req.params, req.body, req.query)
                      : req.body.id;
  var voteFunction = req.vote === true
                      ? voting
                      : reVoting;

  voteFunction(params, function(err, votedRound) {
    if (err) {
      return res.status(400).send(err);
    }
    while(listOfResponse.length) {
      let newRes = listOfResponse.pop();
      try {
        newRes.status(200).send(votedRound);
      }
      catch (e) {
        console.error(e);
      }
    }
    return res.status(200).send(votedRound);
  })
}

exports.getResult = function(req, res, next) {
  var lastTime = parseInt(req.query.time) || 0;
  findLastRound(function(err, round) {
    if (err || round.length === 0) {
      return res.status(400).send('Nothing to show');
    }
    round = round[0];
    if (lastTime < round.lastUpdatedTime) {
      return res.status(200).send(round);
    }
    listOfResponse.push(res);
  })
}
