     "use strict";
      
var mysql = require('mysql')
  , fs = require('fs')
  , xml2js = require('xml2js');
 
 var appConfig = module.exports; 

appConfig.getConnection = function(){

	  var dbCon =  mysql.createConnection({		
	  /*host     : DB_HOST,
	  user     : DB_USER,
	  password : DB_PWD,
	  database : DB_NAME*/
	  host     : 'localhost',
	  user     : 'umakant',
	  password : 'welcome@123',
	  database : 'jdtraffic'
	});
	
	 dbCon.connect();	
	 return dbCon;
};


appConfig.initDb = function(callback){
 
	var parser = new xml2js.Parser({explicitArray : false});
		fs.readFile('./config/config.xml', 'utf8',function(err, data ) {

	    parser.parseString(data,function (err, result) { 
	    	 Object.assign(global, result.databaseInfo);

	       if(err) {
	       	 callback(err);
	       	 return;
	       } else callback(null, result);
	       	       
	    });
	});

};
