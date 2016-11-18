"use strict";
var serviceClient = require("./serviceClient");

var addRuleModel = module.exports;


addRuleModel.getAdRulesByStatement = function(callback) {

      var serviceObj = new serviceClient();
      var statementObj = new statement("WHERE name LIKE 'test%'");
   
   serviceObj.doRequest('AdRuleService', 'getAdRulesByStatement', {statement:statementObj}, function(err, result) {
         if (err) {
         	callback(err);
         	return; 
         } callback(null, result);

   });
   
};

function statement(query) {

	this.query = query;
}


