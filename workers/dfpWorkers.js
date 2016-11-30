var kue = require('kue')
        , restClient = require('../models/restClient')
        , serviceClient = require('../models/serviceClient')
        , companyService = require("../models/companyService")
        , datetime = require('node-datetime')
        , teamService = require("../models/teamService")
        , teamNames = require('../models/teamNames')
        , orderService = require("../models/orderServices")
        , async = require("async")
        , lineItemService = require("../models/lineItemService")
        , userService = require("../models/userServices")
        , customTargetingService = require("../models/customTargetingService")
        , customFieldService = require("../models/customFieldService");




var redisConfig = {

    redis: {
        port: '6380',
        host: 'redis.2adpro.com',
        auth: ''
    }

};


var livePath = {redis: 'redis://redis.2adpro.com:6380'};

var queue = kue.createQueue();


queue.process('push-to-dfp', function (job, done) {

    var data = job.data.lineData;

    var restClientObj = new restClient();


    var errorCount = 0;
    restClientObj.requestName = 'order';
    restClientObj.requestData = data.line_order_id + '?requestType=GET_ORDER_DETAIL';

    var readyOrders = restClientObj.getData();
    var trackingNumber = readyOrders.trackNo;

    var advertiser = readyOrders.advertiserName;
    advertiser = advertiser.replace(/_/g, " ");
    var orderName = readyOrders.name;
    var jobPrefix = orderName.split("-");
    jobPrefix = jobPrefix[0];


    teamName = teamNames[jobPrefix];

    if (teamName == undefined) {
        teamName = readyOrders.siteName;
    }


    if (jobPrefix == 'DESC') {

        if (readyOrders.siteId == 358)
            teamName = 'Hampshire and Dorset';
        else
            teamName = readyOrders.siteName;

        if (readyOrders.siteId == 296)
            teamName = "South East";
    } else if (jobPrefix == 'WG') {
        teamName = 'Wales';
    } else {

        if (readyOrders.siteId == '356')
            teamName = 'Hampshire and Dorset';
    }
    var startDateTimeType = 'USE_START_DATE_TIME';

    var dt = datetime.create();
    var fomratted = dt.format('Y-m-d');


    if (advertiser != '') {

        var whereCond = " where name=" + "'" + advertiser + "'" + " and type='ADVERTISER'";
    } else {

        var whereCond = '';

    }

    companyService = new companyService();
    async.waterfall([
        function (callback) {

            companyService.queryStatement = whereCond;
            companyService.getCompaniesByStatement(function (err, companyResponse) {

                /* console.log("whereCond", whereCond);
                 console.log("err", err);
                 console.log("companyResponse", companyResponse.rval.results[0]);
                 done(null, data);
                 return;  */

                if (companyResponse.hasOwnProperty('rval') && companyResponse.rval.totalResultSetSize == 0) {

                    callback(null, 0);


                } else {

                    callback(null, companyResponse.rval.results[0]);
                }

            });

        },
        function (companyResponse, callback) {


            if (companyResponse == 0) {

                if (teamName == undefined) {
                    var whereTeam = "";
                } else {
                    var whereTeam = "WHERE name = " + "'" + teamName + "'";
                }

                teamService = new teamService();
                teamService.queryStatement = whereTeam;

                teamService.getTeamsByStatement(function (err, teamResponse) {

                    var teamId = '';

                    /*if (teamResponse.hasOwnProperty('rval') && teamResponse.rval.totalResultSetSize != 0) {
                     
                     teamId = teamResponse.rval.results.id;
                     }
                     
                     if (teamResponse.hasOwnProperty('statusCode')) {
                     
                     errorCount = 1;
                     } */

                    // companyService = new companyService();


                    companyService.name = advertiser;
                    companyService.type = "ADVERTISER";
                    if (teamId != '')
                        companyService.appliedTeamIds = [teamId];


                    companyService.createCompanies(function (err, createCompanyResponse) {

                        /* if (result.hasOwnProperty('statusCode')) {
                         
                         errorCount = 1;
                         
                         } else if(result.hasOwnProperty("rval")) {
                         
                         companyResponse = result.rval.results;
                         } */

                        callback(null, createCompanyResponse.rval.results[0]);

                    });



                });

            } else {


                callback(null, companyResponse);
            }

        },

        function (companyResponse, callback) {


            orderService = new orderService();
            orderService.queyStatement = "WHERE name = '" + orderName + "' ORDER BY lastModifiedDateTime desc";
            orderService.getOrdersByStatement(function (err, orderResponse) {

                if (orderResponse.hasOwnProperty("rval") && orderResponse.rval.totalResultSetSize == 1) {
                    callback(null, companyResponse, orderResponse.rval.results[0]);
                } else {

                    callback(null, companyResponse, 0);
                }

            });

        },

        function (companyResponse, orderResponse, callback) {


            if (orderResponse != 0) {

                var restClientObj = new restClient();
                restClientObj.requestName = 'order';
                var dfpOrderId = orderResponse.id;

                restClientObj.requestData = readyOrders.id + '?dfp_order_id=' + dfpOrderId + '&requestType=UPDATE_DFP_NO';

                restClientObj.updateData(function (err, result) {

                    callback(null, companyResponse, orderResponse, 0);

                });

            } else {

                //if (errorCount == 0) {

                userService = new userService();
                userService.queryStatement = "WHERE email = 'umakant.b@2adpro.com' and status='ACTIVE'";

                userService.getUsersByStatement(function (err, userResponse) {

                    callback(null, companyResponse, orderResponse, userResponse.rval.results[0]);


                });


                //            }


            }

        },

        function (companyResponse, orderResponse, userResponse, callback) {

            if (orderResponse == 0) {

                customFieldService = new customFieldService();

                customFieldService.queryStatement = "WHERE name = '2ad2Pro'";

                customFieldService.getCustomFieldsByStatement(function (err, customFieldResponse) {

                    callback(null, companyResponse, orderResponse, userResponse, customFieldResponse);

                });
            } else {

                callback(null, companyResponse, orderResponse, userResponse, 0);

            }

        },
        function (companyResponse, orderResponse, userResponse, customFieldResponse, callback) {

            if (orderResponse == 0) {

                orderService.orderParams = {DropDownCustomFieldValue: '', advertiserId: companyResponse.id, name: orderName, userId: userResponse.id, trackNo: trackingNumber, teamName: teamName};

                orderService.createOrder(function (err, createOrderResponse) {

                    var restClientObj = new restClient();
                    restClientObj.requestName = 'order';
                    var dfpOrderId = createOrderResponse.rval.results[0].id;

                    restClientObj.requestData = readyOrders.id + '?dfp_order_id=' + dfpOrderId + '&requestType=UPDATE_DFP_NO';

                    restClientObj.updateData(function (err, result) {

                        callback(null, companyResponse, createOrderResponse.rval.results[0]);

                    });

                });
            } else {

                callback(null, companyResponse, orderResponse); //customFieldResponse => 0, createOrderResponse => 0
            }


        },

        /*  userResponse and customFieldResponse has been no longer use for bellow functionality,
         *  so it just droped here
         *    
         */
        function (companyResponse, orderResponse, callback) {


            lineItemService = new lineItemService();

            if (data.name != '') {
                var whereLineItem = "WHERE name = '" + data.name + "'";
            } else {
                var whereLineItem = "WHERE OrderId = '" + orderResponse.id + "'";
            }

            lineItemService.queryStatement = whereLineItem + " ORDER BY Id LIMIT 0,20";

            lineItemService.getLineItemsByStatement(function (err, lineItemresponse) {

                if (lineItemresponse.hasOwnProperty('rval') && lineItemresponse.rval.totalResultSetSize != 0) {


                    var restClientObj = new restClient();
                    restClientObj.requestName = 'line-item';
                    var dfpLineId = lineItemresponse.rval.results[0].id;

                    restClientObj.requestData = data.line_id + '?dfp_line_id=' + dfpLineId + '&requestType=UPDATE_DFP_NO';

                    restClientObj.updateData(function (err, result) {

                        callback(null, companyResponse, orderResponse, lineItemresponse.rval.results[0]);

                    });


                } else {

                    callback(null, companyResponse, orderResponse, 0);

                }


            });

        },
        function (companyResponse, orderResponseDetails, lineItemresponse, callback) {




            var lineItemObj = new LineItemDFP();
            //oLineItem.id = data; //Doubt

            var date = data.start_date;
            date = date.split(" ");
            var time = date;
            date = date[0].split("-");

            var startDate = new Date();
            startDate.year = date[0];
            startDate.month = date[1];
            startDate.day = date[2];
            time = time[1].split(":");

            var startDatetime = new DateTime();
            startDatetime.date = startDate;

            startDatetime.timeZoneID = "America/New_York";
            //"Europe/London";
            startDatetime.hour = time[0];
            startDatetime.minute = time[1];
            startDatetime.second = time[2];

            date = data.end_date;
            date = date.split(" ");
            time = date;
            date = date[0].split("-");

            var endDate = new Date();
            endDate.year = date[0];
            endDate.month = date[1];
            endDate.day = date[2];

            time = time[1].split(":");

            var endDatetime = new DateTime();

            endDatetime.date = startDate;

            endDatetime.timeZoneID = "America/New_York";
            //"Europe/London";
            endDatetime.hour = time[0];
            endDatetime.minute = time[1];
            endDatetime.second = time[2];





            var lineItemType = data.lineItemType;

            lineItemObj.name = data.name;
            lineItemObj.orderId = orderResponseDetails.id;
            lineItemObj.startDateTime = startDatetime;
            lineItemObj.startDateTimeType = 'IMMEDIATELY'; // check startDate <= current date put it IMMEDIATELY;
            lineItemObj.endDateTime = endDatetime;
            lineItemObj.lineItemType = lineItemType.toUpperCase();
            lineItemObj.targetPlatform = 'ANY';




            if (lineItemType == 'CREATIVE_SET') {

                var roadblock_type = 'CREATIVE_SET';
                var creative_placeholders = data.creativePlaceHolders.split(",");

            } else {

                var roadblock_type = '';
                var creative_placeholders = data.creativePlaceHolders.split(",");

            }

            var creative_size = creative_placeholders[0].split("x");
            var image_width = creative_size[0];
            var image_height = creative_size[1];

            // $placeholder_width = $image_width;
            //$placeholder_height = $image_height;



            if (roadblock_type == '') {
                if (image_width == '1' && image_height == '1') {

                    var wAndHdata = [];
                    var widthAndHeight = []
                    widthAndHeight['width'] = image_width;
                    widthAndHeight['height'] = image_height;
                    widthAndHeight['isAspectRatio'] = false;

                    wAndHdata['size'] = widthAndHeight;
                    wAndHdata['creativeSizeType'] = 'INTERSTITIAL';
                    creative_placeholders = wAndHdata;

                } else {

                    var sizes = creative_placeholders;
                    var creative_placeholders = [];


                    for (var i in sizes) {

                        if (sizes[i] == 'Out of page (INTERSTITIAL)') {
                            creative_placeholders_size = ["1", "1"];

                        } else {

                            creative_placeholders_size = sizes[i].split('x');

                        }

                        creative_size = new DFPSize();

                        creative_size.width = creative_placeholders_size[0];
                        creative_size.height = creative_placeholders_size[1];
                        creative_size.isAspectRatio = false;


                        creative_placeholder = new CreativePlaceHolder();
                        creative_placeholder.size = creative_size;

                        if (sizes[i] == 'Out of page (INTERSTITIAL)') {
                            creative_placeholder.creativeSizeType = 'INTERSTITIAL';
                        }

                        creative_placeholders.push(creative_placeholder);
                    }




                    //$creative_placeholders = array("size"=>array("width"=>$image_width,"height"=>$image_height,"isAspectRatio"=>FALSE));
                }
            } else if (roadblock_type == 'MULTI') {

                var creative_placeholders_array = new Array();

                for (var i in creative_placeholders) {

                    var isInterstitial = false;
                    if (creative_placeholders[i] == 'Out of page (INTERSTITIAL)') {
                        isInterstitial = true;
                        var creative_placeholders_size = ["1", "1"];
                    } else {
                        var creative_placeholders_size = creative_placeholders[i].split('x');
                    }


                    var creative_size = new DFPSize();

                    creative_size.width = creative_placeholders_size[0];
                    creative_size.height = creative_placeholders_size[1];
                    creative_size.isAspectRatio = false;

                    var creative_placeholder = new CreativePlaceHolder();

                    creative_placeholder.size = creative_size;

                    if (isInterstitial)
                        creative_placeholder.creativeSizeType = 'INTERSTITIAL';

                    creative_placeholders_array.push(creative_placeholder);
                }
                creative_placeholders = creative_placeholders_array;
            } else {

                var creative_placeholders_array = array();

                var creative_placeholder_master = new CreativePlaceHolder();

                for (var i in creative_placeholders) {

                    if (creative_placeholders[i] == 'Out of page (INTERSTITIAL)') {
                        var creative_size = new DFPSize();

                        creative_size.width = 1;
                        creative_size.height = 1;
                        creative_size.isAspectRatio = false;

                    } else {
                        var creative_placeholders_size = explode('x', $creative_placeholders_size);

                        var creative_size = new DFPSize();

                        creative_size.width = creative_placeholders_size[0];
                        creative_size.height = creative_placeholders_size[1];
                        creative_size.isAspectRatio = false;
                    }

                    if (i == 0) {
                        creative_placeholder_master.size = creative_size;

                        if (creative_placeholders[i] == 'Out of page (INTERSTITIAL)') {
                            creative_placeholder_master.creativeSizeType = 'INTERSTITIAL';
                        }
                    } else {
                        var creative_placeholder = new CreativePlaceHolder();

                        creative_placeholder.size = creative_size;

                        creative_placeholder_master.companions.push(creative_placeholder);
                    }
                }

                creative_placeholders_array.push(creative_placeholder_master);


                creative_placeholders = creative_placeholders_array;


            }

            if (roadblock_type != '' && roadblock_type != 'MULTI') {

                lineItemObj.roadblockingType = roadblock_type;
                lineItemObj.companionDeliveryOption = 'ALL';
            }

            var goal = new Goal();
            goal.units = data.unitsBought;
            goal.unitType = 'IMPRESSIONS';
            lineItemObj.costType = data.costType;


            if (data.lineItemType == 'House') {
                goal.goalType = "DAILY";
            } else if (data.costType == 'CPD') {
                goal.goalType = "DAILY";
            } else {
                goal.goalType = "LIFETIME";
            }


            lineItemObj.primaryGoal = goal;
            lineItemObj.creativeRotationType = "OPTIMIZED";

            var costPUnit = new Money();

            costPUnit.currencyCode = 'CURRENCY_CODE'; // defined constant
            costPUnit.microAmount = (data.costPerUnit * 1000000);

            lineItemObj.costPerUnit = costPUnit;


            if (data.lineItemType != 'SPONSORSHIP') {
                goal.units = data.unitsBought;
                lineItemObj.unitsBought = data.unitsBought;
            } else {
                goal.units = 100;
                lineItemObj.unitsBought = 100;
            }

            lineItemObj.allowOverbook = true;

            lineItemObj.creativePlaceholders = creative_placeholders;

            var custom_field_values = new Array();
            var custom_fields = new Array();

            lineItemObj.notes = data.comments;


            var restClientObj = new restClient();
            restClientObj.requestName = 'line-item';
            restClientObj.requestData = data.line_id + '?requestType=GET_TARGETS';
            var target = restClientObj.getData();

            var targeting = new Array();
            var excluded_targeting = new Array();
            var custom_targets = {};
            var deviceTargets = new Array();
            var placementTargets = new Array();
            var arrayOne = new Array();
            var arrayTwo = new Array();



            for (var m in target) {

                if (target[m].target_type == 1 || target[m].lts_exclude != 1) {

                    targeting.push(target[m].value);
                }
                if (target[m].target_type == '1' && target[m].lts_exclude == '1') {

                    excluded_targeting.push(target[m].value);

                } else if (target[m].target_type == '2' && target[m].grp_cond != 0) {

                    arrayOne = [];
                    arrayTwo = [];

                    arrayOne.push(target[m].value);
                    arrayTwo[target[m].custom_target_type] = arrayOne;
                    custom_targets[target[m].grp_cond] = arrayTwo;

                    //custom_targets[target[m].grp_cond][target[m].custom_target_type][] = target[m].value; // need to look into

                } else if (target[m].target_type == '4') {

                    deviceTargets.push(target[m].value);

                } else if (target[m].target_type == '6') {

                    placementTargets.push(target[m].value);

                }
            }


            var adunit_obj = new AdUnits();

            var targeting_array = targeting;

            var adunit_id = new Array();

            for (var j in targeting_array) {

                var p_adunit_id_arr = targeting_array[j].split('~');

                if (p_adunit_id_arr[1] == '1') {

                    adunit_id[p_adunit_id_arr[0]] = true;

                } else {

                    adunit_id[p_adunit_id_arr[0]] = false;

                }

            }

            var plcement_array = placementTargets;

            var placement_id = new Array();

            for (var k in plcement_array) {

                var p_placement_id_arr = plcement_array[k].split('~');

                if (p_placement_id_arr[1] == '1') {

                    placement_id[p_placement_id_arr[0]] = true;

                } else {

                    placement_id[p_placement_id_arr[0]] = false;

                }
            }

            var exclude_adunit_id = new Array();

            for (var a in excluded_targeting) {
                var p_adunit_id_arr = excluded_targeting[a].split('~');

                if (p_adunit_id_arr[0] == '1') {
                    exclude_adunit_id[p_adunit_id_arr[0]] = true;
                } else {
                    exclude_adunit_id[p_adunit_id_arr[0]] = false;
                }
            }

            var custom_targeting = new CustomTargeting();

            var custom_target_array = new Array();

            var custom_target_value = new Array();

            var len = Object.keys(custom_targets).length;
            var count = 0;
            var customTargetKeyId = new Array();

            var custom_target_value = new Array();
            console.log("custom_targets", custom_targets);
            done(null, data);
            return;

            for (var i in custom_targets) {
                (function (i) {
                    for (var j in custom_targets[i]) {

                        (function (j) {

                            if (j != 'Audience Segment') {
                                customTargetingService = new customTargetingService();


                                if (j != '') {
                                    var whereCond = " where displayName='" + j + "' and type='PREDEFINED' ";
                                } else {
                                    var whereCond = '';
                                }
                                console.log("whereCond", whereCond);
                                customTargetingService.queryStatement = whereCond;

                                customTargetingService.getCustomTargetingKeysByStatement(function (err, customTargetingResponse) {

                                    var customTargetKeyId = '';
                                    if (customTargetingResponse.hasOwnProperty('rval') && customTargetingResponse.rval.totalResultSetSize != 0) {
                                        customTargetKeyId = customTargetingResponse.rval.results[0].id;
                                        
             
                                    }
                                    var arrayData = custom_targets[i][j];
                                    if (!Array.isArray(arrayData)) {
                                        
                                        arrayData = arrayData.split(",");    
                                    }
                                   var innerLen = Object.keys(arrayData).length;
                                   var innerCount = 0;
                                   var customTargetValue = new Array();
                                   
                                    for(var k in arrayData) {
                                        
                                        if (arrayData[k].indexOf("(") != -1) {
                                            
                                            arrayData[k] = arrayData[k].split("(");
                                           // $custm_val = substr($custm_val[1], 0, strlen($custm_val[1]) - 1);
                                             arrayData[k] = arrayData[k][1].substr(0, arrayData[k][1].length);
                                            
                                        }
                                        
                                        
                                         if (customTargetKeyId != '') {
                                        var whereCond = " where customTargetingKeyId='"+customTargetKeyId+"'  AND status = 'ACTIVE' ";

                                        if ( arrayData[k].trim != '') {
                                           var whereCond = whereCond+" and name='"+arrayData[k]+"' and matchType='EXACT' ";
                                        }
                                    } else {
                                        var whereCond = " where status='ACTIVE' ";
                                    }
                                    
                                    customTargetingService = new customTargetingService();
                                    customTargetingService.queryStatement = whereCond;
                                     
                                    customTargetingService.getCustomTargetingValuesByStatement(function(err, result){
                                           
                                            if (result.hasOwnProperty('rval') && result.rval.totalResultSetSize != 0) {
                                                
                                                custom_target_value.push(result.rval.results.id);
                                            } 
                                                
                                        innerCount++;
                                        if (innerCount == innerLen) {
                                            
                                                if (customTargetKeyId != '' && custom_target_value.length > 0) {
                                                    
                                                var custom_target = new CustomCriteria();
                                                    custom_target["CustomCriteriaNode.Type"] = "CustomCriteria";
                                                    custom_target.keyId = customTargetKeyId;
                                                    custom_target.valueIds = custom_target_value;
                                                    custom_target.operator = 'IS';
                                                    custom_target_array[$grp][] = $custom_target;
                                                }
                                            
                                            
                                            
                                        }
                                        
                                    });
                                        
                                    }
                                    
                                    
                                    
                                    count++;

                                    if (count == len) {

                                        console.log("len", len, count);
                                        console.log("customTargetingResponse", customTargetingResponse);

                                        callback(null, companyResponse, orderResponseDetails, lineItemresponse, customTargetKeyIds);

                                    }

                                });

                            } //else callback(companyResponse, orderResponseDetails, lineItemresponse, customTargetKeyId); 
                        })(j);
                    }
                })(i);
            }
        },

        function (companyResponse, orderResponseDetails, lineItemresponse, customTargetKeyId, callback) {

            done(null, data);
            return;


        }
    ], function (err, result) {
        //console.log("result", result); 
        done(null, data.line_id + "- job pushed in DFP successfully");
    });

});


queue.on('job enqueue', function (id, type) {


    kue.Job.get(id, function (err, job) {
        console.log('queued line id', job.data.line_id);

        // conn.query('UPDATE lineitems SET li_status = ? WHERE line_id = ?', ['Q', job.data.line_id], function (err, results) {});

    });

}).on('job start', function (id, result) {

    kue.Job.get(id, function (err, job) {
        //console.log("Job started", job.data, job.data.line_id);
    });

}).on('job failed', function (errorMessage) {

    // console.log("failed", errorMessage);

});


function Date() {}
function DateTime() {}
function LineItemDFP() {}
function DFPSize() {}
function CreativePlaceHolder() {}
function Money() {}
function AdUnits() {}
function CustomTargeting() {}
function Goal() {}
function CustomCriteria(){}
