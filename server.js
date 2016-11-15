    "use strict";
var express = require("express")
  , app = express()
  , debug = require('debug')('server');
  require("./routes/routes")(app);
  const PORT = process.env.PORT || 3000;
  const BASE_ULR = process.env.BASE_ULR || "http://localhost:"+PORT;

 const cluster = require('cluster');
 const http = require('http');
 const numCPUs = require('os').cpus().length;

if (cluster.isMaster) {
  // Fork workers.
  for (var i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('death', function(worker) {
    console.log('worker ' + worker.pid + ' died');
  });
} else {
  app.listen(PORT, function(){
    console.log("Server running on "+BASE_ULR);
  });
}


