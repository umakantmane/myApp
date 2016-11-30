    "use strict";
var express = require("express")
  , app = express()
  , debug = require('debug')('server')
  , db = require("./config/db");
  
  //require("./accessTokeCron");

          
   db.initDb();

  require("./routes/routes")(app);
  require("./routes/kueRoute")(app);
  require('./workers/dfpWorkers');

   //console.log(access_token);
  const PORT = process.env.PORT || 8080;
  const BASE_ULR = process.env.BASE_ULR || "http://localhost:"+PORT;
  


app.listen(PORT, function(){
    console.log("Server running on "+BASE_ULR);
  });

