"use strict";

function serviceClient() { //constructor

	///console.log(access_token);
    var access_token = "ya29.CjGmA5-ui3jEFYkARvyIU67r1iNAvAeSWAK4oqd9GvWvafduC3CFW4Ion5cBh-sapQGv";
    this.dfpUser = new Dfp.User(NETWORK_CODE, APPLICATION_NAME,APP_VERSION, access_token);
  
}

serviceClient.prototype.doRequest = function doRequest(serviceType, OperationName, serviceArgs, callback) {

		this.dfpUser.getService(serviceType, function (err, response) {

			if (err) {
				callback(err);
				return;
			}

			response[OperationName](serviceArgs, callback);
		});

};

module.exports = serviceClient;
