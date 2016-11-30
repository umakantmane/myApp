"use strict";
var serviceClient = require("./serviceClient");



 function lineitemCreativeAsscociationModel() {}


lineitemCreativeAsscociationModel.prototype.getLineItemCreativeAssociationsByStatement = function(done) {

      var serviceObj = new serviceClient();
    
       var query = new statement(this.queryStatement);
    
   serviceObj.doRequest('LineItemCreativeAssociationService ', 'getLineItemCreativeAssociationsByStatement', {filterStatement:query}, done);
   
};

lineitemCreativeAsscociationModel.prototype.createLineItemCreativeAssociations = function(done) {

      var serviceObj = new serviceClient();
    
       var query = new statement(this.queryStatement);
    
   serviceObj.doRequest('LineItemCreativeAssociationService ', 'createLineItemCreativeAssociations', {filterStatement:query}, done);
   
};




function statement(query) {

	this.query = query
}

function LineItemCreativeAssociation (){
	
}



module.exports = lineitemCreativeAsscociationModel;