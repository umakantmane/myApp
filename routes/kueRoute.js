"use strict";

var createJobsModel = require("../models/createJobs");
var pushToDfpModel = require("../models/pushToDfp");

module.exports = function function_name(app) {


   app.get('/createJobs', function(req, res) {
		
		createJobsModel.getJobs(function(err, result){});
                 res.send("Validate Jobs"); 
       
   });
   
   
    app.get('/pushToDfp', function(req, res) {
		
		pushToDfpModel.getJobsToPushInDfp(function(err, result){});
                 
                 res.send("Dfp Jobs");  
       
   });

};

