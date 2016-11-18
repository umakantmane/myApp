/*
var htmlparser = require("htmlparser2");
var parser = new htmlparser.Parser({
    onopentag: function(name, attribs){
        if(name === "div" && attribs.id === "swiffycontainer"){
            console.log(attribs.style);
            var data = attribs.style;
             data = data.split(";").join(":").split(":");
             //data = data.split(":");
             var width = data[1].replace('px', ''); 	
             var height = data[3].replace('px', ''); 	
             console.log(width, height);
        }
    },

}, {decodeEntities: true});
parser.write('<!doctype html><html><head></head><body><div id="swiffycontainer" style="width: 300px; height: 250px"></div></body></html>');
parser.end();*/

var async = require("async");
var request = require("request");


var options = { method: 'GET',
  url: "http://localhost/ws-jdtraffic/web/index.php/line-item/1?requestType=GET_CREATIVES" };





async.waterfall([
    function(callback){

        request(options, function (error, response, body) {
  if (error) throw new Error(error);

  body = JSON.parse(body);
  
  callback(null, body.data[0].line_id);
});
        
    },
    function(arg1, callback){

        request(options, function (error, response, body) {
        
            body = JSON.parse(body);

            request(options, function (error, response, body) {
            
                body = JSON.parse(body);

                callback(null, arg1, body.data[0].lc_creative, body.data[0].lc_creative_link);

            });

        });


    },
    function(arg1,arg2, arg3, callback){
        // arg1 now equals 'three'
        getData(function(err, result) {
              
              callback(null, arg1, arg2, arg3, result);

        });
        
    }
], function (err, result, result2, result3, result4) {
      console.log(result, result2, result3, result4);    
});




function getData(done) {

    request(options, function (error, response, body) {
            
                body = JSON.parse(body);

                done(null,body.data[0].lc_creative_type);

    });
   

}