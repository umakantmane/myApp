"use strict";

function d(data, errors) {


    if (errors.length == 0) {


        var restClientObj6 = new restClient();
        restClientObj6.requestName = 'line-items';
        restClientObj6.requestData = data.line_id + '?line_id=' + lineId;

        restClientObj6.updateData(function (err, errorReport) {


        });
    } else {

        var restClientObj6 = new restClient();
        restClientObj6.requestName = 'line-items';
        restClientObj6.requestData = 'line_id=' + data.line_id;
        restClientObj6.requestBody = errors;

        restClientObj6.updateData(function (err, errorReport) {

        });

    }

    return Promise.resolve(errors);

}

function c(data, errors) {

    var orders = null;
    var price = null;

    var restClientObj = new restClient();
    restClientObj.requestName = 'orders';
    restClientObj.requestData = data.line_order_id + '?requestType=GET_ORDER_DETAIL';

    orders = restClientObj.getData();


    var restClientObj = new restClient();
    restClientObj.requestName = 'line-items';
    restClientObj.requestData = data.line_id + '?requestType=GET_PRICE_CONDITIONS';

    price = restClientObj.getData();

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
            }

            if (data.costPerUnit < cond[data.product] && orders.siteId != '359' && orders.siteId != '360') {
                errors.push(6);
            }

        }

        if (products[a] != data.product) {

            if (orders.siteId != '359' && orders.siteId != '360' && data.product != 1) {
                if (orders.budget < 20) {

                    errors.push('6');

                }
            }
        }
    }


    return Promise.resolve(errors);
}

function b(data, errors) {




    var endDate = new Date(data.end_date);
    var currentDate = new Date();
    endDate = endDate.getTime();
    currentDate = currentDate.getTime();

    if (endDate < currentDate) {
        errors.push(8);

    }



    if (data.isTemplateOrder == 0) {

        var restClientObj = new restClient();
        restClientObj.requestName = 'line-item';
        restClientObj.requestData = data.line_id + '?requestType=GET_CREATIVES';

        var result = restClientObj.getData();



        if (result == '') {   // check empty condition for response object
            errors.push(3);
            console.log("empty", result);
        } else {

            var crSize = new Array();

            for (var i in result) {   //======>

                var advertLink = result[i].lc_creative_link;
                var lcCreative = result[i].lc_creative;

                if (advertLink == '') {

                    errors.push(1);
                } else {

                    /*Check waether advertiser give link is valid or not*/

                    request(advertLink, function (error, response, body) {

                        if (error) {
                            errors.push(2);
                        }

                    });

                }

                if (lcCreative == "") {
                    errors.push(3);
                }

                var creativeType = result[i].lc_creative_type;

                if (creativeType == "Image") {

                    var html_tmp_path = JDX_JOB_PATH + '/' + data.line_order_id + '/' + lcCreative;

                    var dimensions = sizeOf(html_tmp_path);


                    crSize.push(dimensions.width + 'x' + dimensions.height);

                }


                if (creativeType == "HTML5") {

                    var html_tmp_path = JDX_JOB_PATH + '/tmp/' + data.line_id + '/' + lcCreative;


                    var parser = new htmlparser.Parser({
                        onopentag: function (name, attribs) {
                            if (name === "div" && attribs.id === "swiffycontainer") {

                                var data = attribs.style;
                                data = data.split(";").join(":").split(":");

                                var width = data[1].replace('px', '');
                                var height = data[3].replace('px', '');
                                crSize.push(width + 'x' + height);
                            }
                        },

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

        if (templateCreativeResult == '') {

            errors.push(3);
        } else { //======>


            for (var k in templateCreativeResult) { //====> K

                if (templateCreativeResult[k].fieldType == 'url' && templateCreativeResult[k].ctf_is_optional == '0') {

                    var advertLink = templateCreativeResult[k].lc_creative;

                    if (advertLink == "") {
                        errors.push(1);
                    } else {


                        request(advertLink, function (error, response, body) {

                            if (error) {
                                errors.push(2);
                            }

                        });


                    }

                }

                if (templateCreativeResult[k].fieldType == 'file' && templateCreativeResult[k].lc_creative == "" && templateCreativeResult[k].ctf_is_optional == 0) {
                    errors.push(3);
                }

                if (data.product == "3" && templateCreativeResult[k].field_id == "1") {

                    var html_tmp_path = JDX_JOB_PATH + '/' + data.line_order_id + '/' + templateCreativeResult[k].lc_creative;

                    var dimensions = sizeOf(html_tmp_path);
                    // crSize.push(dimensions.width+'x'+dimensions.height);

                    var crSize = dimensions.width + 'x' + dimensions.height;

                    if (dimensions.width != "1280") {

                        errors.push(9);
                    }

                }


                if (data.product == "6" && templateCreativeResult[k].field_id == "16") {

                    var html_tmp_path = JDX_JOB_PATH + '/' + data.line_order_id + '/' + templateCreativeResult[k].lc_creative;

                    var dimensions = sizeOf(html_tmp_path);
                    // crSize.push(dimensions.width+'x'+dimensions.height);

                    var crSize = dimensions.width + 'x' + dimensions.height;

                    if (crSize != "960x250") {

                        errors.push(9);
                    }

                }


                if (data.product == "39" && templateCreativeResult[k].field_id == "10") {

                    var html_tmp_path = JDX_JOB_PATH + '/' + data.line_order_id + '/' + templateCreativeResult[k].lc_creative;

                    var dimensions = sizeOf(html_tmp_path);
                    // crSize.push(dimensions.width+'x'+dimensions.height);

                    var crSize = dimensions.width + 'x' + dimensions.height;

                    if (crSize != "320x50") {

                        errors.push(9);
                    }

                }


            } //<========== K




        }//<======




    }


    var restClientObj = new restClient();
    restClientObj.requestName = 'line-item';
    restClientObj.requestData = data.line_id + '?requestType=GET_TARGETS';

    var target = restClientObj.getData();


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

    }



    return Promise.resolve(errors);


}

function a(data, done) {

    var errors = new Array();
    console.log("A started");

    errors.push(1);

    if (data.creativePlaceHolders == '') {

        errors.push(3);
    }

    return b(data, errors).then(function (result) {

        return c(data, result);

    }).then(function (result) {

        return d(data, result);

    }).then(function (result) {

        console.log("result:", result);

    });

}

a(data, done);




function demo(callback) {

    var count = 0;
    for (var i = 0; i < 10000; i++) {

        count++;
    }
    callback(null, count);
}
