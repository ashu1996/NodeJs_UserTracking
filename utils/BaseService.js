var q = require('q');
var request = require('request');
var Constants = require('../utils/Constants.js');
var Utils = require('../utils/Utils.js');

class BaseService {

	constructor() {
	}

	Get(URL) {
		var deferred = q.defer();
		request({
        	url: URL,
        	method: 'GET'
    	}, function(error, response, body) {
        	if (error) {
            	deferred.reject(error);
        	} else if (response.body.error) {
            	deferred.reject(response);
        	} else if (response.body.status
                && !response.body.status) {
                deferred.reject(response);
            } else {
	            deferred.resolve(response);
        	}
    	});
    	return deferred.promise;
	}

	Get(URL, headers) {
		var deferred = q.defer();
		request({
        	url: URL,
        	qs: headers,
        	method: 'GET'
    	}, function(error, response, body) {
        	if (error) {
                deferred.reject(error);
            } else if (response.body.error) {
                deferred.reject(response);
            } else if (response.body.status
                && !response.body.status) {
                deferred.reject(response);
            } else {
                deferred.resolve(response);
            }
    	});
    	return deferred.promise;
	}

	Post(URL, data) {
		var deferred = q.defer();
		request({
        	url: URL,
        	qs: {'content-type' : 'application/json'},
        	method: 'POST',
        	json: data
    	}, function(error, response, body) {
        	if (error) {
                deferred.reject(error);
            } else if (response.body.error) {
                deferred.reject(response);
            } else if (response.body.status
                && !response.body.status) {
                deferred.reject(response);
            } else {
                deferred.resolve(response);
            }
    	});
    	return deferred.promise;
	}

	Post(URL, headers, data) {
		var deferred = q.defer();
		request({
        	url: URL,
        	qs: headers,
        	method: 'POST',
        	json: data
    	}, function(error, response, body) {
        	if (error) {
                deferred.reject(error);
            } else if (response.body.error) {
                deferred.reject(response);
            } else if (response.body.status
                && !response.body.status) {
                deferred.reject(response);
            } else {
                deferred.resolve(response);
            }
    	});
    	return deferred.promise;
	}
}

var baseService = new BaseService();

module.exports = baseService;