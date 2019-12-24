var bcrypt = require('bcryptjs');
var cryptoRandomString = require('crypto-random-string');
var sendMail = require('./../utils/sendMail')
require('dotenv').config();
var path = require('path')
var jwt = require('jsonwebtoken');
var User = require('./../models/Users')


module.exports = {

    //Register Functionality
    register: function(req, res, next){
        let { userName, email, password, consumerURLverification } = req.body;
      
        //check if user already exists
       User.findOne({email: email})
       .then(function (user){
            if(user){
                return res.status(409).json({
                    message: "User already exists in database",
                    data: ""
                })
            }
            else{
            //Password being hashed
                bcrypt.hash(password,process.env.HASHKEY*1)
                .then((hashedPassword)=>{
                    
                    var verificationCode = cryptoRandomString({length: 10, type: 'url-safe'});
                    //Send verification mail
                    sendMail({
                        from: process.env.SMTP_FROM_MAIL,
                        to: email,
                        subject: 'Account Verification Mail',
                        text: `Please find below code to verify your email: 
                            ${verificationCode}.
                            URL for verification: ${consumerURLverification}
                        `
                        // http://localhost:${process.env.PORT}/accVerification/${verificationCode}
                     
                    }, function (err, data) {
                        if (err)
                            return res.status(502).json({
                                message: "Verification mail not sent successfully",
                                data: err
                            });
                        //Add user to DB if successfully sent mail
                        let newUser = new User({
                            userName: userName,
                            email: email,
                            password: hashedPassword,
                            verificationCode: verificationCode,
                            isVerified: false
                        });
                        newUser.save();

                        return res.status(200).json({
                            message: "User Successfully registered",
                            data: ''
                        })
                    });
                })
            }
        });
    },
    //Account verification via mail functionality
    accVerification: function(req, res, next){
        let verificationCode = req.params.code;
     
        User.findOne({verificationCode: verificationCode})
        .then(function(user){
            if(!user)
                return res.status(404).json({
                    message: "Invalid code",
                    data: ''
                })

            if(user.isVerified == true)
                return res.status(200).json({
                    message: "User already verified",
                    data: ''
                })
            user.isVerified = true;
            user.save();
            return res.status(200).json({
                message: "User email successfully verified",
                data: ''
            })
        })
    },

    //Login functionality
    login: function(req, res, next){

        let { email, password } = req.body;

        //Set/Check JWT for login attempts 
        if (!req.headers || !req.headers.token) {
            login_count = 0;
        }
        else{
        jwt.verify(
            req.headers.token,
            process.env.JWT_SECRET,
            function (err, decoded) {
                //handling error
                if(err)
                    console.log(`__________________JWT Error: ${err}____________________`)
                else{
                    if(decoded.login_count){
                        if(decoded.login_count ==3){
                            console.log('Block login')
                        }
                    }
                    else if(decoded.email){
                        res.status(200).json({
                            message: "User already logged in.",
                            data: ""
                        })
                    }
                }
            });
        }

        //////////////////////////////////////

       
        User.findOne({email: email})
        .then(function(user){
            if(!user){
                return res.status(401).json({
                    message: "Invalid Username",
                    data: {token: jwt.sign({login_count: login_count+1}, process.env.JWT_SECRET)}
                });
            }
            if(!user.isVerified){
                return res.status(401).json({
                    message: "Account not verified",
                    data: {token: jwt.sign({login_count: login_count+1}, process.env.JWT_SECRET)}
                });
            }
            if(!bcrypt.compareSync(password, user.password))
                    return res.status(401).json({
                        message: "Incorrect Password",
                        data: {token: jwt.sign({login_count: login_count+1}, process.env.JWT_SECRET)}
                    });
                
                return res.status(200).json({
                    message: "Successful login",
                    data: {
                        userName: user.userName,
                        token: jwt.sign({
                            email: user.email}, process.env.JWT_SECRET),
                        likes: user.likes,
                        dislikes: user.dislikes,
                        favourites: user.favourites
                    }
                });
        })

    },

    //Send mail for forgot password functionality
    forgotPwd: function(req, res, next){
        let { email } = req.body;
      
        let passwordResetCode = cryptoRandomString({length: 10, type: 'url-safe'});

        //Check if user exists in DB
        User.findOne({email: email})
        .then(function(user){
            if(!user)
                return res.status(401).json({
                    message: "Invalid user",
                    data: ""
                });
            else{
                user.passwordResetCode = passwordResetCode;
                user.passwordExpiryDate = Date.now() + 3*24*60*60*1000;
                sendMail({
                    from: process.env.SMTP_FROM_MAIL,
                    to: email,
                    subject: 'Password Reset Link',
                    text: `Find the code to reset your password: ${passwordResetCode}`
                },
                function(err,data){
                    if (err)
                        return res.status(502).json({
                            message: "Reset password mail not sent successfully",
                            data: err
                        });
                    
                    user.save();
                    return res.status(200).json({
                        message: "Reset password mail sent to user",
                        data: ""
                    });
        
                })
            }
        });
    },

    //Reset password via reset code functionality
    resetPwd: function(req, res, next){
        let { resetCode } = req.params;
        let { newPassword } = req.body;
        
        User.findOne({passwordResetCode: resetCode})
        .then(function(user){
            if(!user)
                return res.status(401).json({
                    message: "Invalid reset code",
                    data: ""
                });
            else{
                if(user.passwordExpiryDate < Date.now()){
                    return res.status(200).json({
                        message: "Reset Code Expired",
                        data: ""
                    })
                }
                newPassword = bcrypt.hashSync(newPassword,process.env.HASHKEY*1, (v)=>v);

                user.password = newPassword;
                user.passwordResetCode = null;
                return res.status(200).json({
                    message: "Password reset",
                    data: ''
                })

            }
        })
    }
}
