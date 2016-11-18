"use strict";

var Client = require('node-rest-client').Client;
var client = new Client();
var request = require('sync-request');

const JDTRAFFIC_WS_URL = 'http://localhost/ws-jdtraffic/web/index.php';



function restClient() { //constructor

    //this.requestName;

}

restClient.prototype.getLineItems = function(done) {

	    var restUrl = JDTRAFFIC_WS_URL+'/'+this.requestName;
	 //   console.log(restUrl);

		client.get(restUrl, function (data, response) {

				done(null, data.data);
				return;

		});

};

restClient.prototype.getData = function() {

         var restUrl = JDTRAFFIC_WS_URL+'/'+this.requestName+'/'+this.requestData;

        /* console.log('restUrl', restUrl);
		client.get(restUrl, function (data, response) {

				done(null, data.data);
				return;

		});*/

//  console.log(restUrl);
		
		var res = request('GET', restUrl);
		    res = res.getBody('utf8');
                    res = JSON.parse(res);
		    return res.data;



};

restClient.prototype.updateData = function(done) {

         var restUrl = JDTRAFFIC_WS_URL+'/'+this.requestName+'/'+this.requestData;
      
      //   console.log(restUrl);
         
		
                client.put(restUrl, function (data, response) {
                 
                    done(null, data);
		    return;                            
                });

};

restClient.prototype.createData = function(done) {

         var restUrl = JDTRAFFIC_WS_URL+'/'+this.requestName;
         
        /// console.log(restUrl);

         var args = {

			ata: {errors:this.requestBody},
			headers: { 'content-type': 'application/x-www-form-urlencoded' }
			
		};
   
		client.post(restUrl, args, function (data, response) {

				done(null, data);
				return;

		});

};

module.exports = restClient;

