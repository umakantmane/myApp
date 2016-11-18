"use strict";

function serviceClient() { //constructor

    this.dfpUser = new Dfp.User(global.NETWORK_CODE, global.APPLICATION_NAME, global.APP_VERSION);

	this.dfpUser.setSettings({
		client_id : "726146007796-hbq6req8sh2gsa2rsa4h4dfaksc7v42u.apps.googleusercontent.com",
		client_secret : "1RLq-XwF6W6v7_dKkGEPJij9",
		refresh_token : "1/2Abea6NIIw5oNMZxOOhyVyHhgOwsuYXwJp71Chyu3GU",
		//redirect_url : "https://jdtraffic.2adpro.com/getRefreshAccessTokens.php"
	});

}

serviceClient.prototype.doRequest = function doRequest(serviceType, OperationName, serviceArgs, callback) {

		this.dfpUser.getService(serviceType, function (err, lineItemService) {
			console.log(lineItemService);
			if (err) {
				callback(err);
				return;
			}

			lineItemService[OperationName](serviceArgs, function (err, results) {
				//console.log(results);
				callback(null, results);
			});
		});

}

module.exports = serviceClient;
