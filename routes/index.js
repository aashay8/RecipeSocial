var express = require('express');
var router = express.Router();
const rateLimit = require("express-rate-limit");
var {validate,
      rules: {
            register,
            login,
            forgotPassword,
            resetPassword
          }
  } = require('../utils/validateFields');

  var regexCheck = require('../services/regex_safe_check')

var {
  register: registerController,
  login: loginController,
  accVerification: accVerificationController,
  forgotPwd: forgotPwdController,
  resetPwd: resetPwdController,
  profile: profileController
} = require('./../controllers/index')
 
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: 'Login attempts exceeded maximum tries. Try again after some time.'
});


router.post('/', function(req,res,next){
  //check if token present - go to profile
  //else go to login
});



/**
 * @api {post} /register Registration API
 * @apiName Registration Controller
 * @apiGroup Index
 *
 * @apiParam {String} userName Name of the user
 * @apiParam {String} email Email of the user
 * @apiParam {String} password Password of the user
 * @apiParam {String} consumerURLverification URL of API consumer where verification code needs to be input
 *  
 * @apiSuccess {String} message User Successfully registered
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
          message: "User Successfully registered",
          data: ""
 *     }
 *
 * @apiError MailServerError Code 502 Verification mail not sent successfully
 * @apiError ExistingUser Code 409 User already exists in database
 *           
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 502 Authentication Error
 *     {
 *       "message": "Verification mail not sent successfully"
 *     }
 */
router.post('/register', validate(register),registerController);


/**
 * @api {post} /login Login API
 * @apiName Login Controller
 * @apiGroup Index
 *
 * @apiParam {String} email Email of the user
 * @apiParam {String} password Password of the user
 *  
 * @apiSuccess {String} message Successful login
 * @apiSuccess {String} data {userName:String, token, "likes":[<Array of recipe ids>], "dislikes":[<Array of recipe ids>], "favourites":[<Array of recipe ids>]}
 * 
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
          message: "Successful login",
          data: {
                    userName: <String>,
                    token: jwt String of user data,
                    likes: [recipe IDs],
                    dislikes: [recipe IDs],
                    favourites: [recipe IDs],
                }
 *     }
 *     HTTP/1.1 200 OK
 *     {
          message: "User already logged in.",
          data: ""
 *     }
 *
 * @apiError VerificationError Code 401 Account not verified 
 * @apiError InvalidUser Code 401 Invalid Username
 * @apiError InvalidPassword Code 401 Invalid Password           
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 502 Authentication Error
 *     {
 *        message: "Account not verified",
 *        data: JWT String of {login_count: <Number>}
 *     }
 */
router.post('/login',loginLimiter, validate(login),loginController);

/**
 * @api {get} /accVerification/:code Account verification via mail API
 * @apiName Account Verification Controller
 * @apiGroup Index
 *
 * @apiSuccess {String} message User email successfully verified
 * @apiSuccess {String} message User already verified
 * @apiSuccess {String} data
 * 
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
          message: "User email successfully verified",
          data: ""
 *     }
 *     HTTP/1.1 200 OK
 *     {
          message: "User already verified",
          data: ""
 *     }
 *
 * @apiError InvalidURL Code 404 Invalid code 
 * 
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 404 Code Error
 *     {
 *        message: "Invalid Code",
 *        data: ""
 *     }
 */
router.get('/accVerification/:code', accVerificationController);

/**
 * @api {post} /forgotPassword Forgot Password Mail generation API
 * @apiName Forgot Password Controller
 * @apiGroup Index
 *
 * @apiParam {String} email Email of the user
 *  
 * @apiSuccess {String} message Reset password mail sent to user
 * @apiSuccess {String} data
 * 
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
          message: "Reset password mail sent to user",
          data: ""
 *     }
 *
 * @apiError InvalidUser Code 401 Invalid Username
 * @apiError MailError Code 502 Reset password mail not sent successfully         
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 502 Reset password mail not sent successfully
 *     {
 *        message: "Reset password mail not sent successfully",
 *        data: err
 *     }
 */
router.post('/forgotPassword', validate(forgotPassword), forgotPwdController);

/**
 * @api {all} /resetPwd/:resetCode Reset Password API
 * @apiName Reset Password Controller
 * @apiGroup Index
 *
 * @apiParam {String} email Email of the user
 * @apiParam {String} newPassword new Password to set for user 
 *  
 * @apiSuccess {String} message Password reset
 * @apiSuccess {String} data
 * 
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
          message: "Password reset",
          data: ""
 *     }
 *
 * @apiError InvalidCode Code 401 Invalid reset code
 * @apiError ExpiredCode Code 502 Reset Code Expired         
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 502 Reset Code Expired
 *     {
 *        message: "Reset Code Expired",
 *        data: ""
 *     }
 */
router.all('/resetPwd/:resetCode', validate(resetPassword), resetPwdController);

module.exports = router;
