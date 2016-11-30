"use strict";
var serviceClient = require("./serviceClient");


 

function orderModel() {}



orderModel.prototype.getOrdersByStatement = function(done) {

      var serviceObj = new serviceClient();     
      var query = new statement(this.queyStatement);


      console.log(query);
    
   serviceObj.doRequest('OrderService', 'getOrdersByStatement', {filterStatement:query}, done);
   
};


orderModel.prototype.createOrder = function(done) {

      var serviceObj = new serviceClient();
      var orderObj = new Order(this.orderParams);
        
        //this.orderParams.customFields['Trafficking Team'];

        console.log("orderObj", orderObj);
    
   serviceObj.doRequest('OrderService', 'createOrders', {orders:orderObj}, done);
   

};

/*
orderModel.updateOrders = function(callback) {

      var serviceObj = new serviceClient();
      var orderObj = new order();
    
   serviceObj.doRequest('OrderService', 'updateOrders', {orders:orderObj}, function(err, result) {
         if (err) {
         	callback(err);
         	return; 
         } callback(null, result);

   });
   
};*/


function Order(data) {

	this.name = data.name;
	this.advertiserId = data.advertiserId;
	this.traffickerId = data.userId;
  //this.poNumber = 12345;  //responded with error, if we use poNumber

}


function statement(query) {

     this.query = query;     

}

module.exports = orderModel;