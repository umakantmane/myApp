"use strict";
var serviceClient = require("./serviceClient");


var lineItemModel = module.exports;


lineItemModel.createLineItems = function(callback) {

      var serviceObj = new serviceClient();
      var lineItemObj = new lineItem();
    
   serviceObj.doRequest('LineItemService', 'createLineItems', {lineItems:lineItemObj}, function(err, result) {
         if (err) {
         	callback(err);
         	return; 
         } callback(null, result);

   });
   
};

lineItemModel.getLineItemsByStatement = function(callback) {

      var serviceObj = new serviceClient();
      var lineItemObj = new statement(""); //"WHERE status = 'ACTIVE' ORDER BY id LIMIT 30"
    
   serviceObj.doRequest('LineItemService', 'getLineItemsByStatement', {filterStatement:lineItemObj}, function(err, result) {
         if (err) {
         	callback(err);
         	return; 
         } callback(null, result);

   });
   
};



function statement(query) {

	this.query = query
}


function lineItem() {

      var goalObj = new goal();
      goalObj.unitType = 'UNKNOWN';
	  goalObj.goalType = "";
      var TextValueObj = new TextValue();
      //console.log(TextValueObj);
	this.orderId = 477866649
	this.name = "2WTW lineItem";
	this.orderName = "2WTW";
	this.startDateTime = "";
	//this.startDateTimeType = ""// optional
	//this.endDateTime = "";
	this.autoExtensionDays = 1;
	this.unlimitedEndDateTime = false;
	this.creativeRotationType = "EVEN";
	this.lineItemType = "STANDARD";
	this.priority = 5// 1-16 priority
	this.costPerUnit = '';
	this.costType = "UNKNOWN";
	this.creativePlaceholders = {size:{width:10,height:10,isAspectRatio:false}};
	this.environmentType = "BROWSER";
	this.creativePersistenceType = "NOT_PERSISTENT";
	this.allowOverbook = true;
	this.skipInventoryCheck = false;
	this.skipCrossSellingRuleWarningChecks =false;
	this.reserveAtCreation = false;
	//this.stats = "INACTIVE";
	this.disableSameAdvertiserCompetitiveExclusion = true;
	//this.customFieldValues = TextValueObj;
	this.primaryGoal = goalObj;
	this.targeting = "";
}

function goal(){


}

function TextValue() {
	this.value = "Something";
	this.CustomFieldValue = "CustomFieldValue";
}