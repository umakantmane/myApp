
   "use strict";

var lineItemService = require("../models/lineItemService");
var companyService = require("../models/companyService");
var orderService = require("../models/orderServices");
var userService = require("../models/userServices");
var adRuleService = require("../models/adRuleService");
var teamService = require("../models/teamService");
var customFieldService = require("../models/customFieldService");
var customTargetingService = require("../models/customTargetingService");
var audienceSegmentService = require("../models/audienceSegmentService");
var creativeTemplateService = require("../models/creativeTemplateService");
var lineItemCreativeAssociationService = require("../models/lineItemCreativeAssociationService")
var getAccessToken = require("../models/getAccessToken");


customFieldService = new customFieldService();

companyService = new companyService();
 teamService = new teamService();
 orderService = new orderService();
 userService = new userService();
 lineItemService = new lineItemService();
 customTargetingService = new customTargetingService();
  audienceSegmentService = new audienceSegmentService();
  creativeTemplateService = new creativeTemplateService();
  lineItemCreativeAssociationService = new lineItemCreativeAssociationService();
  getAccessToken = new getAccessToken();

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

      app.get("/getAccessToken", function(req, res){

      		getAccessToken.refresh_token = '1/2Abea6NIIw5oNMZxOOhyVyHhgOwsuYXwJp71Chyu3GU';
		  getAccessToken.getAccessToken(function(err, result){
	
		  	   if(err)
		  	    res.send(err);
		  	    else
		  	    res.send(result);

		  });
	  });


	  app.get("/getCompaniesByStatement", function(req, res){

	  	       companyService.queryStatement = "WHERE name = 'xyz.com' and type='ADVERTISER'";

		  companyService.getCompaniesByStatement(function(err, result){
	
		  	   if(err)
		  	    res.send(err);
		  	    else
		  	    res.send(result);

		  });
	  });

         app.get("/getLineItemCreativeAssociationsByStatement", function(req, res){

	  	       lineItemCreativeAssociationService.queryStatement = "";

		  lineItemCreativeAssociationService.getLineItemCreativeAssociationsByStatement(function(err, result){
	
		  	   if(err)
		  	    res.send(errerr);
		  	    else
		  	    res.send(result);

		  });
	  });
         
          
	   app.get("/getCreativeTemplatesByStatement", function(req, res){

	  	       creativeTemplateService.queryStatement = "";

		  creativeTemplateService.getCreativeTemplatesByStatement(function(err, result){
	
		  	   if(err)
		  	    res.send(err);
		  	    else
		  	    res.send(result);

		  });
	  });

	  app.get("/getCustomTargetingKeysByStatement", function(req, res){

	  	       customTargetingService.queryStatement = "where type='PREDEFINED'";

		  customTargetingService.getCustomTargetingKeysByStatement(function(err, result){
	
		  	   if(err)
		  	    res.send(err);
		  	    else
		  	    res.send(result);

		  });
	  });

	   app.get("/getAudienceSegmentsByStatement", function(req, res){

	  	       audienceSegmentService.queryStatement = "";

		  audienceSegmentService.getAudienceSegmentsByStatement(function(err, result){
	
		  	   if(err)
		  	    res.send(err);
		  	    else
		  	    res.send(result);

		  });
	  });


	  app.get("/getCustomTargetingValuesByStatement", function(req, res){

	  	       customTargetingService.queryStatement = "";

		  customTargetingService.getCustomTargetingValuesByStatement(function(err, result){
	
		  	   if(err)
		  	    res.send(err);
		  	    else
		  	    res.send(result);

		  });
	  });

	   app.get("/getCustomFieldsByStatement", function(req, res){

	  	       customFieldService.queryStatement = "";

		  customFieldService.getCustomFieldsByStatement(function(err, result){
	
		  	   if(err)
		  	    res.send(err);
		  	    else
		  	    res.send(result);

		  });
	  });


	   app.get("/getTeamsByStatement", function(req, res){

		  	       teamService.queryStatement = "WHERE name = 'South East'";

			  teamService.getTeamsByStatement(function(err, result){
		
			  	   if(err)
			  	    res.send(err);
			  	    else
			  	    res.send(result);

			  });
	  });

	    app.get("/createTeams", function(req, res){

		  teamService.createTeams(function(err, result){
	
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

          orderService.orderParams = "";
		  orderService.createOrder(function(err, result){
		  	 
		  	   if(err)
		  	    res.send(err);
		  	    else
		  	    res.send(result);

		  });
	  });


	   app.get("/getOrdersByStatement", function(req, res){

           orderService.queyStatement = "WHERE name = '2WTW' ORDER BY lastModifiedDateTime desc";
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

           userService.queryStatement = "WHERE email = 'umakant.b@2adpro.com' and status='ACTIVE'";
   
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


	    	lineItemService.queryStatement = "WHERE OrderId = '480575769'";
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