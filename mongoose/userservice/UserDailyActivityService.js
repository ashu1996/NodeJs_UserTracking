const UserDailyActivitySchema = require('./domain/UserDailyActivitySchema.js');
const Constants = require('../../utils/Constants.js');
const Utils = require('../../utils/Utils.js');

class UserDailyActivityService {

	constructor() {
		
	}

	getMongoConnected() {
		return Constants.IS_MONGODB_CONNECTED;
	}

	save(data, callback) {
		var dataSet = new UserDailyActivitySchema({
			userid: data.userid
		,	token: data.token
		,	latitude: data.lat
		,	longitude: data.lng
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
			UserDailyActivitySchema.findOne(fbData, function(err, data) {
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
			UserDailyActivitySchema.find(function(err, dataList) {
				callback(err, dataList);
	  			// if (err) return console.error(err);
  				// console.info(dataList);
			});
		} else {
			callback("Mongo Connection Error :(", null);
		}
	}
}

var userDailyActivityService = new UserDailyActivityService();

module.exports = userDailyActivityService;