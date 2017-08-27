var mongoose = require('mongoose');

var userDailyActivitySchema = new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, index: true, required: true, auto: true, unique: true }
, userid: {type: String, required: true}
, token: {type: String, required: true}
, createdDate: {type: Date, default: Date.now}
, latitude: {type: String, default: ""}
, longitude: {type: String, default: ""}
});

module.exports = mongoose.model('UserDailyActivity', userDailyActivitySchema);