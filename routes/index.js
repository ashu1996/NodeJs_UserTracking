var express = require('express');
var router = express.Router();
var path= require('path');

/* GET home page. */
router.get(["/", "", "/login",'/home/**', "/home/**/**"], function(req, res, next) {
  res.sendFile(path.resolve('views') + '/index.html'); // load the single view file (angular will handle the page changes on the front-end)
  // res.sendFile('index.html'); // load the single view file (angular will handle the page changes on the front-end)
});

module.exports = router;