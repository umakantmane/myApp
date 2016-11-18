"use strict";

var createJobsModel = require("../models/createJobs");

console.log(baseUrl);
module.exports = function function_name(app) {


   //app.get('/createJobs', function(req, res) {
		
		createJobsModel.getJobs(function(err, result){

            /*if (err) {
            	res.send(err);
            	return;
            }else           
            res.send(result)*/

		});
       
 //  });

}

