"use strict";
var serviceClient = require("./serviceClient");

var userModel = module.exports;


userModel.createUsers = function(callback) {

      var serviceObj = new serviceClient();
      var usersObj = new user();
    
   serviceObj.doRequest('UserService', 'createUsers', {users:usersObj}, function(err, result) {
         if (err) {
         	callback(err);
         	return; 
         } callback(null, result);

   });
   
};

userModel.getUsersByStatement = function(callback) {

      var serviceObj = new serviceClient();     
      var query = new statement("WHERE name LIKE 'umakant%'");
    
   serviceObj.doRequest('UserService', 'getUsersByStatement', {filterStatement:query}, function(err, result) {
         if (err) {
         	callback(err);
         	return; 
         } callback(null, result);

   });
   
};

userModel.getAllRoles = function(callback) {

      var serviceObj = new serviceClient();     
    
   serviceObj.doRequest('UserService', 'getAllRoles', function(err, result) {
         if (err) {
            callback(err);
            return; 
         } callback(null, result);

   });
   
};


userModel.getCurrentUser = function(callback) {

      var serviceObj = new serviceClient();     
    
   serviceObj.doRequest('UserService', 'getCurrentUser', function(err, result) {
         if (err) {
            callback(err);
            return; 
         } callback(null, result);

   });
   
};



function user() {

    //this.id = "put id here to update ur ordee"; // uncomment this line for update ur order
	this.name = 'Manas';
	this.email = 'umakantm33@gmail.com';
   this.roleId = -1;
   this.roleName = 'Administrator';
   this.isActive = true;
   this.isEmailNotificationAllowed = true;
   this.isServiceAccount = false;

}


function statement(query) {

     this.query = query;     
     
}