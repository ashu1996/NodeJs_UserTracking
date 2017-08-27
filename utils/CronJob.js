var cron = require('cron');
var MobileService = require('../mongoose/MobileService.js');

//    CRON JOB URL: https://www.npmjs.com/package/cron
//	  CRON JOB URL: http://merencia.com/node-cron
//    '* * * * * *' - runs every second
//    '*/5 * * * * *' - runs every 5 seconds
//    '10,20,30 * * * * *' - run at 10th, 20th and 30th second of every minute
//    '0 * * * * *' - runs every minute
//    '0 0 * * * *' - runs every hour (at 0 minutes and 0 seconds)
//    '00 30 11 * * 1-5' - Runs every weekday (Monday through Friday) at 11:30:00 AM. It does not run on Saturday or Sunday.
var CronJob = cron.job("00 30 08 * * 1-7", function(){
    // perform operation e.g. GET request http.get() etc.
    console.info("Inside Cron Job", new Date().getTime());
    MobileService.findAll(function(err, dataList) {

    });
}); 
CronJob.start();
console.info("CronJob Started");