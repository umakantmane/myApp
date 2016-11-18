"use strict";
var serviceClient = require("./serviceClient");

var orderModel = module.exports;


orderModel.createOrder = function(callback) {

      var serviceObj = new serviceClient();
      var orderObj = new order();
      console.log(orderObj);
    
   serviceObj.doRequest('OrderService', 'createOrders', {orders:orderObj}, function(err, result) {
         if (err) {
         	callback(err);
         	return; 
         } callback(null, result);

   });
   
};

orderModel.getOrdersByStatement = function(callback) {

      var serviceObj = new serviceClient();     
      var query = new statement("WHERE name LI+KE '2WTW%'");
    
   serviceObj.doRequest('OrderService', 'getOrdersByStatement', {filterStatement:query}, function(err, result) {
         if (err) {
         	callback(err);
         	return; 
         } callback(null, result);

   });
   
};

orderModel.updateOrders = function(callback) {

      var serviceObj = new serviceClient();
      var orderObj = new order();
    
   serviceObj.doRequest('OrderService', 'updateOrders', {orders:orderObj}, function(err, result) {
         if (err) {
         	callback(err);
         	return; 
         } callback(null, result);

   });
   
};


function order() {

//this.id = "put id here to update ur ordee"; // uncomment this line for update ur order
	this.name = "2WTW";
	this.startDateTime = "";
   this.endDateTime = "";
	this.unlimitedEndDateTime = false;
	this.status = "DRAFT";
	this.advertiserId = 84342369;
	this.creatorId = 193870569; //userId
	this.traffickerId = 193870569;

}


function statement(query) {

     this.query = query;     

}