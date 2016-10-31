     "use strict";
      
var mysql = require('mysql');

var appConfig = module.exports; 

appConfig.getConnection = function(){
	
	  var dbCon =  mysql.createConnection({		
	  host     : 'localhost',
	  user     : 'umakant',
	  password : 'welcome@123',
	  database : 'generic'
	});
	
	 dbCon.connect();	
	 return dbCon;
};

