var mongoose = require('mongoose');

var userAttendanceSchema = new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, index: true, required: true, auto: true, unique: true }
, userid: {type: String, required: true}
, attendance: { type: Boolean, default: false}
, imageUrl: {type: String, required: false}
, createdDate: {type: Date, default: Date.now}
, modifiedDate: {type: Date, default: Date.now}
, latitude: {type: String, default: ""}
, longitude: {type: String, default: ""}
, authToken: {type: String, default: ""}
});

module.exports = mongoose.model('UserAttendanceDetails', userAttendanceSchema);