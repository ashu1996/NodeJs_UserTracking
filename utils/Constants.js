class Constants {

	constructor() {
		this.PORT = process.env.PORT || 3000;
	//	this.MONGODB_URI = process.env.MONGODB_URI || "mongodb://<USER_NAME>:<PASSWORD>@<DOMAIN_NAME>:<PORT>/<DB_NAME>";
		this.MONGODB_URI = process.env.MONGODB_URI || "mongodb://dev02.novuse.com:27017/UserTracking";
		this.IS_MONGODB_CONNECTED = false;
		this.jwtSecret = "Ad6F3GTRfeq==";
	}
}

var constants = new Constants();

module.exports = constants;