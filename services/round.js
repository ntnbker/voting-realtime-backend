var Schema = __mongodb.Schema;

var schema = new Schema({
  name: String,
  isActive: Boolean,
  startTime: Number,
  endTime: Number,
  information: String,
  votes: [{
    name: String,
    inviteeId: String,
    votedTime: Number,
    answer: String,
  }],
  dateCreated: Number,
  lastUpdatedTime: Number,
})

schema.index({endTime: 1, startTime: 1}, {name: 'inTime'});

schema.pre('save', function(next) {
  var date = new Date().getTime();
  var _this = this;
  if (_this.isNew) {
    _this.dateCreated = date;
  }
  _this.lastUpdatedTime = date;
  return next();
})

module.exports = __mongodb.model('round', schema);
