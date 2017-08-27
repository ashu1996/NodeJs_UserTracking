var express                 = require('express');
var router                  = express.Router();
var responseUtil            = require('../utils/ResponseUtil.js');
var Utils                   = require('../utils/Utils.js');
var constant                = require('../utils/Constants.js');
var jwt                     = require('jsonwebtoken'); // used to create, sign, and verify tokens
var multer                  = require('multer'); // Reference URL: https://github.com/expressjs/multer
var path                    = require('path');

/**
  Multr Disk Storage Initialization
  Defining Image Storage Paths and Change file Name
*/
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve('public') + '/images/uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname))
  }
});

/**
  Multr Defining Max Image File Size upto 3 MB
  Defining only Single Image Can Upload with key name 'avatar'
*/
var fileUploader = multer({
  dest: path.resolve('public') + '/images/uploads/',
  limits: {
    fileSize: 3 * 1024 * 1024,
    files: 1
  },
  storage: storage,
  rename: function (fieldname, filename) {
    return filename+"_"+Date.now();
  },
  onFileUploadStart: function (file) {
    console.log(file.originalname + ' is starting to upload');
  },
  onFileUploadComplete: function (file) {
    console.log(file.originalname + ' uploaded to  ' + file.path);
  }
}).single('avatar');


/**
  Check Content-Type in Header in Request
*/
router.use(function(req, res, next) {
    if (req.method === 'GET') {
      next();
    } else if(Utils.checkNotUndefined(req.headers['content-type'])
      && (req.headers['content-type'].indexOf('application/json') > -1
        || req.headers['content-type'].indexOf('multipart/form-data') > -1) ) {
        next();
    } else {
        return res.status(405).json({ status: false, message: 'Invalid Request Content-Type' });
    }
});

/**
  Get List of All Users
  End Point: api/v1/user/
  Request Type: GET
*/
router.get('/', function(req, res, next) {
  req.getConnection( function(err, conn) {
      if (err) return res.status(500).json(responseUtil.fail(err));

        conn.query("SELECT user_id, user_name, email_id, user_type, (CASE WHEN (active = 1) THEN 'true' ELSE 'false' END) AS active, phone_number, last_attendance FROM ??", ['UserDetails'], function(err, rows) {
          if(err) {
            console.log(err);
            return res.status(404).json(responseUtil.fail(err.sqlMessage));
          }

          return res.status(200).json(responseUtil.success(rows));
        });

    });
});

/**
  Register New User
  End Point: api/v1/user/register
  Request Type: POST
  Request Json:
  {
    "username": "test",
    "contact": 98xxxxxxxx,
    "password": 123456789,
    "email": test@yopmail.com,
    "userType": ADMIN/FIELD_USER,
    "active": true 
  }
*/
router.post('/register', function(req, res, next) {
  var userData = {
    user_name: req.body.username,
    phone_number: req.body.contact,
    password: Utils.encrypt(req.body.password),
    email_id: req.body.email,
    user_type: req.body.userType,
    active: req.body.active,
    assigned_tokens: JSON.stringify([]),
    last_attendance: false
  };
  req.getConnection( function(err, conn) {
      if (err) return res.status(500).json(responseUtil.fail(err));

        conn.query("INSERT INTO ?? SET ?", ['UserDetails', userData], function(err, rows) {
          if(err) {
            console.log(err);
            return res.status(500).json(responseUtil.fail(err.sqlMessage));
          }

          conn.query("SELECT user_id, user_name, email_id, user_type, active, phone_number FROM ?? WHERE ?? = ? AND ?? = ?", ['UserDetails', 'user_name', userData.user_name, 'password', userData.password], function(err, rows) {
            if(err) {
              console.log(err);
              return res.status(404).json(responseUtil.fail(err.sqlMessage));
            }

            return res.status(200).json(responseUtil.success(rows[0]));
          });
        });

    });
});

/**
  Login for any User Type and Get auto generated Auth-Token
  End Point: api/v1/user/login
  Request Type: POST
*/
router.post('/login', function(req, res, next) {

  var userData = {
    username: req.body.username,
    password: Utils.encrypt(req.body.password)
  };

  req.getConnection( function(err, conn) {
      if (err) return res.status(500).json(responseUtil.fail(err));

        conn.query("SELECT * FROM ?? WHERE ?? = ? AND ?? = ?", ['UserDetails', 'user_name', userData.username, 'password', userData.password], function(err, rows) {
          if(err) {
            console.log(err);
            return res.status(404).json("Invalid Username or Password !!!");
          }

          var dataObj = rows[0];
          dataObj.assigned_tokens = JSON.parse(rows[0].assigned_tokens);
          dataObj.token = jwt.sign({id: rows[0].user_id}, constant.jwtSecret, { expiresIn: '1d' });
          if (!Utils.checkNotUndefined(dataObj.assigned_tokens))
            dataObj.assigned_tokens = [];
          if(Utils.checkNotUndefined(dataObj.token))
            dataObj.assigned_tokens.push(dataObj.token);
          conn.query("UPDATE ?? SET ? WHERE ?? = ?", ['UserDetails', {assigned_tokens: JSON.stringify(dataObj.assigned_tokens)}, 'user_id', dataObj.user_id], function(err, rows) {
            if(err) console.log(err);
          });
          dataObj.password = undefined;
          if(dataObj.active) dataObj.active = true;
          else dataObj.active = false;
          if(dataObj.last_attendance) dataObj.last_attendance = true;
          else dataObj.last_attendance = false;
          dataObj.created_date = undefined;
          dataObj.modified_date = undefined;
          dataObj.assigned_tokens = undefined;
          return res.status(200).json(responseUtil.success(dataObj));
        });

    });
});

/**
  Validate Auth-Token
  End Point: api/v1/user/validateToken/{token}
  Request Type: GET
*/
router.get('/validateToken/:token', function(req, res, next) {
  jwt.verify(req.params.token, constant.jwtSecret, function(err, decoded) {
    if (err) return res.status(401).json(responseUtil.fail(err));

    req.getConnection( function(err, conn) {
      if (err) return res.status(500).json(responseUtil.fail(err));

        conn.query("SELECT assigned_tokens FROM ?? WHERE ?? = ?", ['UserDetails', 'user_id', decoded.id], function(err, rows) {
          if(err) {
            console.log(err);
            return res.status(404).json(responseUtil.fail(err.sqlMessage));
          }

          var dataObj = rows[0].assigned_tokens;
          dataObj = JSON.parse(dataObj);
          if(dataObj.length <= 0 && dataObj.indexOf(req.params.token) < 0)
            return res.status(401).json(responseUtil.fail('Invalid Token, Please login again.'));
          else
            return res.status(200).json(responseUtil.success('Token Verified Successfully !!!'));
        });
    });
  });
});

/**
  Remove Auth-Token
  End Point: api/v1/user/logout/{token}
  Request Type: GET
*/
router.get('/logout/:token', function(req, res, next) {
  jwt.verify(req.params.token, constant.jwtSecret, function(err, decoded) {
    if (err) return res.status(401).json(responseUtil.fail(err));

    req.getConnection( function(err, conn) {
      if (err) return res.status(500).json(responseUtil.fail(err));

        conn.query("SELECT assigned_tokens FROM ?? WHERE ?? = ?", ['UserDetails', 'user_id', decoded.id], function(err, rows) {
          if(err) {
            console.log(err);
            return res.status(404).json(responseUtil.fail(err.sqlMessage));
          }

          var dataObj = rows[0].assigned_tokens;
          dataObj = JSON.parse(dataObj);
          if(dataObj.length > 0 && dataObj.indexOf(req.params.token) < 0)
            return res.status(401).json(responseUtil.fail('Invalid Token, Please try again.'));
          else {

            var index = dataObj.indexOf(req.params.token);
            delete dataObj[index];
            conn.query("UPDATE ?? SET ? WHERE ?? = ?", ['UserDetails', {assigned_tokens: JSON.stringify(dataObj)}, 'user_id', dataObj.user_id], function(err, rows) {
              if(err) console.log(err);
              return res.status(200).json(responseUtil.success('User logout Successfully !!!'));
            });
          }
        });
    });
  });
});

/**
  Upload Multipart Image
  End Point: api/v1/user/uploadImage
  Request Type: POST
*/
router.post('/uploadImage', function(req, res) {
  fileUploader(req, res, function (err) {
    if (err) return res.status(403).json(responseUtil.fail(err));
    req.file.imageUrl = "http://dev02.novuse.com/images/uploads/" + req.file.filename;
    return res.status(200).json(responseUtil.success(req.file));
  });
});

/**
  Mark Attendance By User
  End Point: api/v1/user/markAttendance
  Request Type: POST
*/
router.post('/markAttendance', function(req, res, next) {
  var authToken = req.headers['x-authtoken'];
  jwt.verify(authToken, constant.jwtSecret, function(err, decoded) {
    if (err) return res.status(401).json(responseUtil.fail(err));

    req.getConnection( function(err, conn) {
      if (err) return res.status(500).json(responseUtil.fail(err));

        conn.query("SELECT last_attendance, assigned_tokens FROM ?? WHERE ?? = ?", ['UserDetails', 'user_id', decoded.id], function(err, rows) {
          if(err) {
            console.log(err);
            return res.status(404).json(responseUtil.fail(err.sqlMessage));
          }

          var dataObj = rows[0].assigned_tokens;
          dataObj = JSON.parse(dataObj);
          if(dataObj.length > 0 && dataObj.indexOf(authToken) < 0)
            return res.status(401).json(responseUtil.fail('Invalid Token, Please try again.'));
          else {

            fileUploader(req, res, function (err) {
              if (err) return res.status(403).json(responseUtil.fail(err));

              req.file.imageUrl = "http://dev02.novuse.com/images/uploads/" + req.file.filename;

              var userData = {
                user_id: decoded.id,
                image_url: req.file.imageUrl,
                authtoken: authToken,
                latitude: req.body.lat,
                longitude: req.body.lng
              };
          

              var userD={};

               switch (req.body.attendance_state)
              {
                case '1': userD.attendance_state = 2; break;
                case '2': userD.attendance_state = 3; break;
                case '3': userD.attendance_state = 1; break;

              }


              conn.query("UPDATE ?? SET ? WHERE ?? = ?", ['UserDetails', {attendance_state: userD.attendance_state}, 'user_id', decoded.id], function(err, rows) {
                if(err) console.log(err);
              });



               conn.query("INSERT INTO ?? SET ?", ['UserAttendance', userData], function(err, rows) {
                if(err) {
                  console.log(err);
                  return res.status(500).json(responseUtil.fail(err.sqlMessage));
                }
                return res.status(200).json(responseUtil.success("Attendance Marked Successfully !!!"));
              });


             
            });
          }
        });
    });
  });
});

/**
  Save user location
  End Point: api/v1/user/dailyActivity
  Request Type: POST
*/
router.post('/dailyActivity', function(req, res, next) {
  var authToken = req.headers['x-authtoken'];
  jwt.verify(authToken, constant.jwtSecret, function(err, decoded) {

    var oneTimeSentResponse = false;
    if (err) return res.status(401).json(responseUtil.fail(err));

    var dataObject = {
        user_id: decoded.id,
        authtoken: authToken
      };

    var values = [];

    var data = req.body;
    if(data.locations && data.locations.length > 0) {

      req.getConnection( function(err, conn) {
        if (err) return res.status(500).json(responseUtil.fail(err));

        for(var i = 0, len = data.locations.length; i < len; i++) {
          dataObject.latitude = data.locations[i].lat.toString();
          dataObject.longitude = data.locations[i].lng.toString();
          if(i === (len - 1)) {
            conn.query("UPDATE ?? SET ? WHERE ?? = ?", ['UserDetails', {latitude: dataObject.latitude, longitude: dataObject.longitude}, 'user_id', decoded.id], function(err, rows) {
              if(err) console.log(err);
            });
          }
          conn.query("INSERT INTO ?? SET ?", ['UserDailyActivity', dataObject], function(err, rows) {
            if(!oneTimeSentResponse) {
              oneTimeSentResponse = true;
              if(err) {
                console.log(err);
                return res.status(500).json(responseUtil.fail(err.sqlMessage));
              }
              return res.status(200).json(responseUtil.success("Successfully Inserted !!!"));
            }
          });
        }

      });

    } else if (err) return res.status(404).json(responseUtil.fail("Couldn't found any location"));

  });
});

/**
  Get dashboard details
  End Point: api/v1/user/dashboardDetails
  Request Type: GET
*/
router.get('/dashboardDetails', function(req, res, next) {
  req.getConnection( function(err, conn) {
    if (err) return res.status(500).json(responseUtil.fail(err));
    
    conn.query("SELECT (SELECT COUNT(user_id) FROM UserDetails WHERE active = 1) AS totalActiveUsers, (SELECT COUNT(user_id) FROM UserDetails WHERE active = 1 AND last_attendance = 1) AS totalCheckedInUsers, (SELECT COUNT(user_id) FROM UserDetails WHERE active = 0) AS totalInActiveUsers", function(err, rows) {
      if(err) {
        console.log(err);
        return res.status(500).json(responseUtil.fail(err.sqlMessage));
      }
      var dataSet = {
        misc : rows[0]
      };
      conn.query("SELECT user_id, user_name, latitude, longitude FROM UserDetails", function(err, rows1) {
        if(err) {
          console.log(err);
          return res.status(500).json(responseUtil.fail(err.sqlMessage));
        }
        dataSet.userDetails = rows1;
        return res.status(200).json(responseUtil.success(dataSet));
      });
    });

  });

});

/**
  Find User By Id
  End Point: api/v1/user/{userId}
  Request Type: GET
*/
router.get('/:id', function(req, res, next) {
  req.getConnection( function(err, conn) {
      if (err) return res.status(500).json(responseUtil.fail(err));

        conn.query("SELECT user_id, user_name, email_id, user_type, (CASE WHEN (active = 1) THEN 'true' ELSE 'false' END) AS active, phone_number, last_attendance FROM ?? WHERE ?? = ?", ['UserDetails', 'user_id', req.params.id], function(err, rows) {
          if(err) {
            console.log(err);
            return res.status(404).json(responseUtil.fail(err.sqlMessage));
          }

          return res.status(200).json(responseUtil.success(rows[0]));
        });

    });
});

module.exports = router;