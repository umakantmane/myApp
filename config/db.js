     "use strict";
      
var mysql = require('mysql')
  , fs = require('fs')
  , parser = require('xml2json');

 var appConfig = module.exports; 

appConfig.getConnection = function(){
	
	  var dbCon =  mysql.createConnection({		
	  host     : DB_HOST,
	  user     : DB_USER,
	  password : DB_PWD,
	  database : DB_NAME
	});
	
	 dbCon.connect();	
	  global.conn = dbCon; // take a look into connection close object

	   conn.query("select oak_access_token from oauth_access_key WHERE oak_acc_id = ?",[4], function(err, result){
             
             global.access_token = result[0].oak_access_token;
  
     });
     
};


appConfig.initDb = function() {

		var data = fs.readFileSync('./config/config.xml', 'utf8');

		 data = parser.toJson(data, {object:true});

		Object.assign(global, data.databaseInfo);

		this.getConnection();

};


