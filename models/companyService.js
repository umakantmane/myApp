"use strict";
var serviceClient = require("./serviceClient");

var companyModel = module.exports;


  companyModel.createCompanies = function(callback) {

      var serviceObj = new serviceClient();
      var companyObj = new company();
    
   serviceObj.doRequest('CompanyService', 'createCompanies', {companies:companyObj}, function(err, result) {
         if (err) {
         	callback(err);
         	return; 
         } callback(null, result);

   });
   
};

companyModel.getCompaniesByStatement = function(callback) {

      var serviceObj = new serviceClient();
      var query = new statement("WHERE name LIKE '2wordstheworld%'");
               
      serviceObj.doRequest('CompanyService', 'getCompaniesByStatement', {filterStatement:query}, function(err, result) {
         if (err) {
         	callback(err);
         	return; 
         } callback(null, result);
   });
   
};

companyModel.updateCompanies = function(callback) {

      var serviceObj = new serviceClient();
      var companyObj = new company();
               
      serviceObj.doRequest('CompanyService', 'updateCompanies', {companies:companyObj}, function(err, result) {
         if (err) {
         	callback(err);
         	return; 
         } callback(null, result);
   });
   
};


/*
 * Comment this.id = "83922489" line, when creating new company, 
 * This value is read-only and is assigned by Google when the company is created.
 * id attribute is required for updates..
*/

function company() {

  //this.id = "83922489"; 
	this.name = "xyz.com";
	this.type = "ADVERTISER";
	this.address = "Bangalore";
	this.email = "xxxxxxxx@xxxxx.xxx";
	this.creditStatus = "ACTIVE";

}

function statement(query) {

    this.query = query;

}
