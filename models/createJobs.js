"use strict";

var db = require('../config/db');

var kue = require('kue');
var queue = kue.createQueue();
var https = require('https');




var createJobs = module.exports;

var restClient = require('./restClient');

createJobs.getJobs = function (callback) {

    var restClientObj = new restClient();


    restClientObj.requestName = 'line-item';

    restClientObj.getLineItems(function (err, result) {

        if (err) {
            console.log("Error", err);
            return;
        } else {


            for (var i in result) {

                var jobs = queue.create('lineitems', {line_id: result[i].line_id, title: "LineItem-" + result[i].line_id, lineData: result[i]});//.attempts(3);

                jobs.on('failed attempt', function (errorMessage, doneAttempts) {

                    console.log('Job failed', errorMessage, doneAttempts);

                });

                jobs.on('failed', function (errorMessage) {

                    console.log("failed", errorMessage);

                });

                jobs.on('complete', function (result) {

                    console.log('Job completed with data ', result.line_id);

                    //update status as job completed
                });

                jobs.on('progress', function (progress, data) {

                    console.log('\r  Progress Report job #' + job.id + ' ' + progress + '% complete with data ', data);

                });

                jobs.save(function (err) {
                    if (err)
                        console.log(err);
                });

                /*jobs.attempts(3).backoff(function (attempts, delay) {

                    console.log("Repeat", attempts, delay);

                });*/

            }

        }

    });


};

