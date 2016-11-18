var kue = require('kue');
var sizeOf = require('image-size');
var htmlparser = require("htmlparser2");
var restClient = require('../models/restClient');
var request = require('request');
var requestSyn = require('sync-request');



var redisConfig = {

    redis: {
        port: '6380',
        host: 'redis.2adpro.com',
        auth: ''
    }

};

var livePath = {redis: 'redis://redis.2adpro.com:6380'};

var queue = kue.createQueue();


queue.process('lineitems',  function (job, done) {


    var data = job.data.lineData;
    
    console.log("lineId:", data.line_id);
    var errors = new Array();
    var errorsDesc = new Array();


    if (data.creativePlaceHolders == '') {

        errors.push(3);
        errorsDesc.push("Creative Missing");
    }


    var endDate = new Date(data.end_date);
    var currentDate = new Date();
    endDate = endDate.getTime();
    currentDate = currentDate.getTime();

    if (endDate < currentDate) {
        errors.push(8);
        errorsDesc.push("Date in past");

    }

    if (data.isTemplateOrder == 0) {

        var restClientObj = new restClient();
        restClientObj.requestName = 'line-item';
        restClientObj.requestData = data.line_id + '?requestType=GET_CREATIVES';

        var result = restClientObj.getData();

        if (result == '') {   // check empty condition for response object
            errors.push(3);
            errorsDesc.push("Creative Missing");
           // console.log("empty", result);
        } else {
            //console.log("GET_CREATIVES", result);

            var crSize = new Array();

            for (var i in result) {   //======>

                var advertLink = result[i].lc_creative_link;
                var lcCreative = result[i].lc_creative;

                if (advertLink == '') {

                    errors.push(1);
                } else {

                    /*Check waether advertiser give link is valid or not*/

                    var res = requestSyn('GET', advertLink);

                    if (res.statusCode == undefined) {

                        errors.push(2);
                        errorsDesc.push("Advertiser url incorrect");
                    }

                }

                if (lcCreative == "") {
                    errors.push(3);
                    errorsDesc.push("Creative Missing");
                }

                var creativeType = result[i].lc_creative_type;

                if (creativeType == "Image") {

                    // var html_tmp_path = JDX_JOB_PATH + '/' + data.line_order_id + '/' + lcCreative;
                    var html_tmp_path = '../ganesh.jpg';

                    var dimensions = sizeOf(html_tmp_path);

                    crSize.push(dimensions.width + 'x' + dimensions.height);

                }


                if (creativeType == "HTML5") {

                    //var html_tmp_path = JDX_JOB_PATH + '/tmp/' + data.line_id + '/' + lcCreative;

                    var parser = new htmlparser.Parser({
                        onopentag: function (name, attribs) {
                            if (name === "div" && attribs.id === "swiffycontainer") {

                                var data = attribs.style;
                                data = data.split(";").join(":").split(":");

                                var width = data[1].replace('px', '');
                                var height = data[3].replace('px', '');
                                crSize.push(width + 'x' + height);
                            }
                        }

                    }, {decodeEntities: true});
                    parser.write(result[i].lc_html_snippet);
                    //parser.write('<!doctype html><html><head></head><body><div id="swiffycontainer" style="width: 300px; height: 250px"></div></body></html>');
                    parser.end();

                }

            } //<======

        }


        var allCreatives = data.creativePlaceHolders.split(",");

        for (var j in allCreatives) {

            if (allCreatives[i] == 'Out of page (INTERSTITIAL)') {

                allCreatives.splice(j, 1);

            }

        }

    }


    if (data.creativePlaceHolders.indexOf("Out of page (INTERSTITIAL)") != -1 || data.isTemplateOrder != 0) {


        

        var restClientObj = new restClient();
        restClientObj.requestName = 'line-item';
        restClientObj.requestData = data.line_id + '?requestType=GET_TEMPLATE_CREATIVES';

        var templateCreativeResult = restClientObj.getData();

         //console.log("templateCreativeResult", templateCreativeResult);

        if (templateCreativeResult == '') {
            //console.log("templateCreativeResult");
            errors.push(3);
            errorsDesc.push("Creative Missing");

        } else { //======>


            for (var k in templateCreativeResult) { //====> K

                if (templateCreativeResult[k].fieldType == 'url' && templateCreativeResult[k].ctf_is_optional == '0') {

                    var advertLink = templateCreativeResult[k].lc_creative;

                    if (advertLink == "") {
                        errors.push(1);
                        errorsDesc.push("Advertiser Url missing");
                    } else {

                        var res = requestSyn('GET', advertLink);

                        if (res.statusCode == undefined) {

                            errors.push(2);
                            errorsDesc.push("Advertiser url incorrect");
                        }

                    }

                }

                if (templateCreativeResult[k].fieldType == 'file' && templateCreativeResult[k].lc_creative == "" && templateCreativeResult[k].ctf_is_optional == 0) {

                    errors.push(3);
                    errorsDesc.push("Creative Missing");

                }

                if (data.product == "3" && templateCreativeResult[k].field_id == "1") {

                    //var html_tmp_path = JDX_JOB_PATH + '/' + data.line_order_id + '/' + templateCreativeResult[k].lc_creative;
                     var html_tmp_path = '../ganesh.jpg';

                    var dimensions = sizeOf(html_tmp_path);
                    // crSize.push(dimensions.width+'x'+dimensions.height);

                    var crSize = dimensions.width + 'x' + dimensions.height;

                    if (dimensions.width != "1280") {

                        errors.push(9);
                    }

                }


                if (data.product == "6" && templateCreativeResult[k].field_id == "16") {

                    //var html_tmp_path = JDX_JOB_PATH + '/' + data.line_order_id + '/' + templateCreativeResult[k].lc_creative;
                    
                     var html_tmp_path = '../ganesh.jpg';

                    var dimensions = sizeOf(html_tmp_path);
                    // crSize.push(dimensions.width+'x'+dimensions.height);

                    var crSize = dimensions.width + 'x' + dimensions.height;

                    if (crSize != "960x250") {

                        errors.push(9);
                        errorsDesc.push("Creative Size Mismatch");
                    }

                }


                if (data.product == "39" && templateCreativeResult[k].field_id == "10") {

                    //var html_tmp_path = JDX_JOB_PATH + '/' + data.line_order_id + '/' + templateCreativeResult[k].lc_creative;
                     var html_tmp_path = '../ganesh.jpg';

                    var dimensions = sizeOf(html_tmp_path);
                    // crSize.push(dimensions.width+'x'+dimensions.height);

                    var crSize = dimensions.width + 'x' + dimensions.height;

                    if (crSize != "320x50") {

                        errors.push(9);
                        errorsDesc.push("Creative Size Mismatch");
                    }

                }


            } //<========== K

        }//<======

    }


    var restClientObj = new restClient();
    restClientObj.requestName = 'line-item';
    restClientObj.requestData = data.line_id + '?requestType=GET_TARGETS';

    var target = restClientObj.getData();

    //console.log("target", target);


    var targetMissing = true;

    for (var m in target) {


        if (target[m].target_type == 1 || target[m].target_type == 6) {
            targetMissing = false;

            if (target[m].target_name == "") {
                targetMissing = true;
            }
        }
    }


    if (targetMissing == true) {

        errors.push(5);
        errorsDesc.push("Targeting Missing");

    }


    var restClientObj = new restClient();
    restClientObj.requestName = 'order';
    restClientObj.requestData = data.line_order_id + '?requestType=GET_ORDER_DETAIL';

    var orders = restClientObj.getData();

    //console.log("orders", orders);


    var restClientObj = new restClient();
    restClientObj.requestName = 'line-item';
    restClientObj.requestData = data.line_id + '?requestType=GET_PRICE_CONDITIONS';

    var price = restClientObj.getData();

    //console.log("price", price);

    var products = [];
    var price_condition = [];
    var cond = new Array();


    for (var n in price) {
        if (price[n].costType == 'budget') {

            products.push(price[n].productId);
            // cond.push({price[n].productId:price[n].cost});
            cond[price[n].productId] = price[n].cost;
        }

        if (price[n].costType == 'CPM') {

            products.push(price[n].productId);
            // cond.push({price[n].productId:price[n].cost});
            cond[price[n].productId] = price[n].cost;
        }
    }

    for (var a in products) {

        if (products[a] == data.product) {

            if (orders.budget < cond[data.product] && orders.siteId != '359' && orders.siteId != '360') {
                errors.push(6);
                errorsDesc.push("Net price is less than minimum value");
            }

            if (data.costPerUnit < cond[data.product] && orders.siteId != '359' && orders.siteId != '360') {
                errors.push(6);
                errorsDesc.push("Net price is less than minimum value");
            }

        }

        if (products[a] != data.product) {

            if (orders.siteId != '359' && orders.siteId != '360' && data.product != 1) {
                if (orders.budget < 20) {

                    errors.push('6');
                    errorsDesc.push("Net price is less than minimum value");

                }
            }
        }
    }

    var restClientObj = new restClient();


    if (errors.length == 0) {

        console.log("No errors");

        restClientObj.requestName = 'line-item';
        restClientObj.requestData = data.line_id;

        restClientObj.updateData(function (err, result) {});

        //done(null, data); // job competed with successfully

        pushToDfp(data, done);

    } else {

        console.log("errors", errors);
        restClientObj.requestName = 'line-item';
        restClientObj.requestData = data.line_id;
        restClientObj.requestBody = errors;

        restClientObj.createData(function (err, result) {});

        done(errorsDesc.join(",")); // job failed

    }

});


queue.on('job enqueue', function (id, type) {
    console.log('Job %s got queued of type %s', id, type);

    //update job in queue

}).on('job start', function (id, result) {

    kue.Job.get(id, function (err, job) {
        //console.log("Job started", job.data, job.data.line_id);
    });

});/*.on('job complete', function(id, result){
 
 console.log(id, result.line_id);
 
 })*/
 var async = require("async");
var request = require("request");

var options = { method: 'GET',
  url: "http://localhost/ws-jdtraffic/web/index.php/line-item/1?requestType=GET_CREATIVES" };



function pushToDfp(data, done) {


    console.log("pushToDfp");
    
   

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
      done(null, data);
});
    

}


function getData(done) {

    request(options, function (error, response, body) {
            
                body = JSON.parse(body);

                done(null,body.data[0].lc_creative_type);

    });
  
}