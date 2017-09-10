var Schema = __mongodb.Schema;

var schema = new Schema({
  name: {type: String, default: 'Invitee' + parseInt(Math.random()*1000 + 1)},
  isActive: {type: Boolean, default: true},
  dateCreated: Number,
  lastUpdatedTime: Number,
  type: String,
})

schema.index({hashName: 1}, {name: 'Find Name'});

schema.pre('save', function(next) {
  var date = new Date().getTime();
  var _this = this;
  if (_this.isNew) {
    _this.dateCreated = date;
  }
  _this.lastUpdatedTime = date;
  return next();
})

module.exports = __mongodb.model('invitee', schema);
