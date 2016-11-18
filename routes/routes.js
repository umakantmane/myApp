
   "use strict";

var lineItemService = require("../models/lineItemService");
var companyService = require("../models/companyService");
var orderService = require("../models/orderServices");
var userService = require("../models/userServices");
var adRuleService = require("../models/adRuleService");

global.Dfp = require('node-google-dfp');

module.exports = function function_name(app) {
	  
	  app.get("/createCompanies", function(req, res){

		  companyService.createCompanies(function(err, result){
	
		  	   if(err)
		  	    res.send(err);
		  	    else
		  	    res.send(result);

		  });
	  });

	  app.get("/getCompaniesByStatement", function(req, res){

		  companyService.getCompaniesByStatement(function(err, result){
	
		  	   if(err)
		  	    res.send(err);
		  	    else
		  	    res.send(result);

		  });
	  });

	  app.get("/updateCompanies", function(req, res){

		  companyService.updateCompanies(function(err, result){
	
		  	   if(err)
		  	    res.send(err);
		  	    else
		  	    res.send(result);

		  });
	  });


	   app.get("/createOrder", function(req, res){

		  orderService.createOrder(function(err, result){
		  	 
		  	   if(err)
		  	    res.send(err);
		  	    else
		  	    res.send(result);

		  });
	  });


	   app.get("/getOrdersByStatement", function(req, res){

		  orderService.getOrdersByStatement(function(err, result){
		  	   
		  	   if(err)
		  	    res.send(err);
		  	    else
		  	    res.send(result);

		  });
	  });


	   app.get("/updateOrders", function(req, res){

		  orderService.updateOrders(function(err, result){
		  	 
		  	   if(err)
		  	    res.send(err);
		  	    else
		  	    res.send(result);

		  });
	  });




	   app.get("/createUsers", function(req, res){

		  userService.createUsers(function(err, result){
		  	  
		  	   if(err)
		  	    res.send(err);
		  	    else
		  	    res.send(result);

		  });
	  });

	    app.get("/getUsersByStatement", function(req, res){

   
		  userService.getUsersByStatement(function(err, result){
		  	   if(err)
		  	    res.send(err);
		  	    else
		  	    res.send(result);

		  });
	  });

	    app.get("/getAllRoles", function(req, res){
   
		  userService.getAllRoles(function(err, result){
		  	  
		  	   if(err)
		  	     res.send(err);
		  	     else
		  	     res.send(result);

		  });
	  }); 

	    app.get("/getCurrentUser", function(req, res){
   
		  userService.getCurrentUser(function(err, result){
		  	  
		  	   if(err)
		  	     res.send(err);
		  	     else
		  	     res.send(result);

		  });
	  }); 

	    app.get("/createLineItems", function(req, res){

		  lineItemService.createLineItems(function(err, result){
		  	   if(err)
		  	     res.send(err);
		  	     else
		  	     res.send(result);

		  });
	  });

	    app.get("/getLineItemsByStatement", function(req, res){

		  lineItemService.getLineItemsByStatement(function(err, result){
		  	   if(err)
		  	     res.send(err);
		  	     else
		  	     res.send(result);

		  });
	  });

	    app.get("/updateLineItems", function(req, res){

		  lineItemService.updateLineItems(function(err, result){
		  	   if(err)
		  	     res.send(err);
		  	     else
		  	     res.send(result);

		  });
	  });



	    app.get("/getAdRulesByStatement", function(req, res){

		  adRuleService.getAdRulesByStatement(function(err, result){
		  	   if(err)
		  	     res.send(err);
		  	     else
		  	     res.send(result);

		  });
	  });

}