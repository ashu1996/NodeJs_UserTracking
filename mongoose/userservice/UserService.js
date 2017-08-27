const UserDomain = require('./domain/UserDetails.js');
const Constants = require('../../utils/Constants.js');
const Utils = require('../../utils/Utils.js');

class UserDetailsService {

	constructor() {
		
	}

	getMongoConnected() {
		return Constants.IS_MONGODB_CONNECTED;
	}

	save(data, callback) {
		var dataSet = new UserDomain({
			username: data.username
		,	contact: data.contact
		,	profileImage: data.profileImage
		,	email: data.email
		,	password: Utils.encrypt(data.password)
		,	modifiedDate: Date.now()
		,	active: true
		,	userType: data.userType
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
			UserDomain.findOne(fbData, function(err, data) {
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
			UserDomain.find(function(err, dataList) {
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

	updatePassword(data, callback) {
		var dataSet = data;
		dataSet.password = Utils.encrypt(data.password);
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

var userDetails = new UserDetailsService();

module.exports = userDetails;