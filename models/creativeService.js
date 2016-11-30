"use strict";
var serviceClient = require("./serviceClient");



 function createCreativeModel() {}


createCreativeModel.prototype.createCreatives = function(done) {

      var serviceObj = new serviceClient();
      var lineItemObj = new lineItem();
    
   serviceObj.doRequest('CreativeService', 'createCreatives', {lineItems:lineItemObj}, done);
   
};




function statement(query) {

	this.query = query
}


function lineItem() {

     
}


module.exports = createCreativeModel;