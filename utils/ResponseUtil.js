class ResponseUtil {

	success(data) {
		return {
			'status': true,
			'data': data
		};
	}

	success(data, errorMessage) {
		return {
			'status': true,
			'data': data,
			'errorMessage': errorMessage
		};
	}

	fail(errorMessage) {
		return {
			'status': false,
			'errorMessage': errorMessage
		};
	}
}

var responseUtil = new ResponseUtil();

module.exports = responseUtil;