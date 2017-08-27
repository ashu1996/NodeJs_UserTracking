// Reference Url: https://www.npmjs.com/package/mongoose-class-wrapper
// http://mongoosejs.com/docs/schematypes.html
var mongoose = require('mongoose');

var userDetailsSchema = new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, index: true, required: true, auto: true }
, username: {type: String, unique: true, required: true}
, contact: { type: String, unique: true, min: 10, max: 10 }
, profileImage: {type: String, required: false}
, email: {type: String, required: false}
, password: { type: String, required: true}
, createdDate: {type: Date, default: Date.now}
, modifiedDate: {type: Date, default: Date.now}
, active: {type: Boolean, default: false}
, userType: {type: String, default: "ADMIN", uppercase: true}
, assignedTokens: {type: [String], required: false}
});

// Compile a 'UserDetails' model using the fbData as the structure.
// Mongoose also creates a MongoDB collection called 'UserDetails' for these documents.
// Export mongoose model 
module.exports = mongoose.model('UserDetails', userDetailsSchema);