// http://lollyrock.com/articles/nodejs-encryption/

const crypto = require('crypto');
const algorithm = 'aes-256-ctr';
const password = 'd6F3Efeq';

const sessions = {};

class Utils {

	constructor() {
	}

  getSessions() {
    return sessions;
  }

	findOrCreateSession(fbid) {
		let sessionId;
  		// Let's see if we already have a session for the user fbid
  		Object.keys(sessions).forEach(k => {
    		if (sessions[k].fbid === fbid) {
      			// Yep, got it!
	      		sessionId = k;
    		}
  		});
  		if (!sessionId) {
    		// No session found for user fbid, let's create a new one
    		sessionId = new Date().toISOString();
    		sessions[sessionId] = {
    			fbid: fbid,
    			context: {
    				sessionId
    			}
    		};
  		}
  		return sessionId;
	}

	StringContains(string1, string2) {
		return string1.indexof(string2) >= 0;
	}

	isEmptyJsonObject(obj) {
  		return !Object.keys(obj).length > 0;
  	}

  isJsonString(str) {
    	try {
        	JSON.parse(str);
    	} catch (e) {
        	return false;
    	}
    	return true;
	}

  isJsonObject(obj) {
      try{
        JSON.stringify(obj);
      } catch (e) {
        return false;
      }
      return true;
  }

  jsonHasProperty(obj, property) {
    if(obj.hasOwnProperty(property)) return true;
    return false;
  }

  encrypt(text){
    var cipher = crypto.createCipher(algorithm,password)
    var crypted = cipher.update(text,'utf8','hex')
    crypted += cipher.final('hex');
    return crypted;
  }

  decrypt(text){
    var decipher = crypto.createDecipher(algorithm,password)
    var dec = decipher.update(text,'hex','utf8')
    dec += decipher.final('utf8');
    return dec;
  }

  checkNotUndefined(query) {
    if ( typeof query !== 'undefined') return true;
    return false;
  }

}

var utils = new Utils();

module.exports = utils;