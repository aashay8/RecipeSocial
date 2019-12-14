var User = require('./../models/Users');
var jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = function(req,res,next){
        if (!req.headers || !req.headers.token) {
            return res.status(401).json({
                message: "No session data found",
                data: ""
            });
        }
        else{
            jwt.verify(
                req.headers.token,
                process.env.JWT_SECRET,
                function (err, decoded) {
                    if(err)
                        return res.status(442).json({
                            message: "Token error",
                            data: err
                        });
                    else if(decoded.email){
                        // res.status(200).json({
                        //     message: "Session Data set",
                        //     data:  jwt.sign({email: decoded.email}, process.env.JWT_SECRET)
                        // })
                        req.user = decoded;
                        next();
                    }
                    else
                        return res.status(442).json({
                            message: "Token error",
                            data: ""
                        });
                });
        }
    }