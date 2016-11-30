"use strict";
var serviceClient = require("./serviceClient");



 function lineItemModel() {}


lineItemModel.prototype.createLineItems = function(done) {

      var serviceObj = new serviceClient();
      var lineItemObj = new lineItem();
    
   serviceObj.doRequest('LineItemService', 'createLineItems', {lineItems:lineItemObj}, done);
   
};

lineItemModel.prototype.getLineItemsByStatement = function(done) {

      var serviceObj = new serviceClient();
      var lineItemObj = new statement(this.queryStatement); //"WHERE status = 'ACTIVE' ORDER BY id LIMIT 30"

      console.log("getLineItemsByStatement", lineItemObj);
    
   serviceObj.doRequest('LineItemService', 'getLineItemsByStatement', {filterStatement:lineItemObj}, done);
   
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

module.exports = lineItemModel;