"use strict";
var serviceClient = require("./serviceClient");




function customTargetingServiceModel() {


}




customTargetingServiceModel.prototype.getCustomTargetingKeysByStatement = function(done) {

      var serviceObj = new serviceClient();
      var query = new statement(this.queryStatement);
               
      serviceObj.doRequest('CustomTargetingService', 'getCustomTargetingKeysByStatement', {filterStatement:query}, done);
   
};


customTargetingServiceModel.prototype.getCustomTargetingValuesByStatement = function(done) {

      var serviceObj = new serviceClient();
      var query = new statement(this.queryStatement);
               
      serviceObj.doRequest('CustomTargetingService', 'getCustomTargetingValuesByStatement', {filterStatement:query}, done);
   
};


function statement(query) {

    this.query = query;

}

module.exports = customTargetingServiceModel;