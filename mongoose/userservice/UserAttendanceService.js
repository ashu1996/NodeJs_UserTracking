const UserAttendanceDomain = require('./domain/UserAttendanceSchema.js');
const Constants = require('../../utils/Constants.js');
const Utils = require('../../utils/Utils.js');

class UserAttendanceService {

	constructor() {
		
	}

	getMongoConnected() {
		return Constants.IS_MONGODB_CONNECTED;
	}

	save(data, callback) {
		var dataSet = new UserAttendanceDomain({
			userid: data.userid
		,	attendance: data.attendance
		,	imageUrl: data.imageUrl
		,	latitude: data.lat
		,	longitude: data.lng
		,	authToken: data.authToken
		});

		if (this.getMongoConnected()) {
			dataSet.save(function(err, dataSet) {
				callback(err, dataSet);
  				// if (err) return console.error(err);
  				// console.dir(dataSet);
			});
		} else {
			callback("Mongo Connection Error :(", null);
		}
	}

	findOne(fbData, callback) {
		if (this.getMongoConnected()) {
			UserAttendanceDomain.findOne(fbData, function(err, data) {
				callback(err, data);
				// if (err) return console.error(err);
  				// console.info(data);
			});
		} else {
			callback("Mongo Connection Error :(", null);
		}
	}

	findAll(callback) {
		if (this.getMongoConnected()) {
			UserAttendanceDomain.find(function(err, dataList) {
				callback(err, dataList);
	  			// if (err) return console.error(err);
  				// console.info(dataList);
			});
		} else {
			callback("Mongo Connection Error :(", null);
		}
	}

	findAllSortByCreatedDate(callback) {
		if (this.getMongoConnected()) {
			UserAttendanceDomain.find({}, null, {sort: {createdDate: 1}}, function(err, dataList) {
				callback(err, dataList);
	  			// if (err) return console.error(err);
  				// console.info(dataList);
			});
		} else {
			callback("Mongo Connection Error :(", null);
		}
	}

	update(data, callback) {
		var dataSet = data;
		dataSet.modifiedDate = Date.now();
		if (this.getMongoConnected()) {
			dataSet.save(function(err, dataList) {
				callback(err, dataSet);
	  			// if (err) return console.error(err);
  				// console.info(dataSet);
			});
		} else {
			callback("Mongo Connection Error :(", null);
		}
	}
}

var userAttendance = new UserAttendanceService();

module.exports = userAttendance;