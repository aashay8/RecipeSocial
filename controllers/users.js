
var bcrypt = require('bcryptjs');
var cryptoRandomString = require('crypto-random-string');
var sendMail = require('./../utils/sendMail')
require('dotenv').config();
var path = require('path')
var jwt = require('jsonwebtoken');
var User = require('./../models/Users')

module.exports={
    
    //Display profile data
    profile: function(req,res,next){
        //______________________Not required due to authentication middleware___________
        // if (!req.headers || !req.headers.token) {
        //     return res.status(422).json({
        //         message: "The token is required.",
        //         data: ""
        //     });
        // }
        
        let { email, userName } = req.user;
        User.findOne({email})
        .then((user)=>{
                return res.status(200).json({
                    message: "Profile Data",
                    data: {
                        userName: user.userName,
                        email: email,
                        location: user.location,
                        gender: user.gender,
                        mobile: user.mobile

                    }
                });
            }
        )
        
    },

    //Set like on recipe
    toggleLike: function(req,res,next){
        let {recipe_id} = req.body;
        let { email, userName } = req.user;
        
        User.findOne({email})
        .then((user)=>{
            if(!user)
                return res.status(442).json({
                    message: "Invalid User",
                    data: ""
                })
            //No likes set yet    
            if(!('likes' in user)){
                
                user.likes = [];
                user.likes.push(recipe_id);
                //Remove from dislikes
                if('dislikes' in user){
                    if(user.dislikes.indexOf(recipe_id) != -1){
                        user.dislikes = user.dislikes.filter(v=> v!=recipe_id);
                    }
                }
                user.save();
            }
            //Previous likes set
            else{
                //Like not present for selected recipe 
                if(user.likes.indexOf(recipe_id) == -1){
                    user.likes.push(recipe_id);
                    if('dislikes' in user){
                        if(user.dislikes.indexOf(recipe_id) != -1){
                            user.dislikes = user.dislikes.filter(v=> v!=recipe_id);
                        }
                    }
                    user.save();
                }
                //Liked already - to be toggled to neutral
                else{
                    user.likes = user.likes.filter(v=> v!=recipe_id);
                    user.save();
                }
            }
            
            return res.status(200).json({
                message: "success",
                data: {
                    likes: user.likes,
                    dislikes: user.dislikes
                }
            })
        });
    },

    //Set dislike on recipe
    toggleDislike: function(req,res,next){
        let {recipe_id} = req.body;
        let { email, userName } = req.user;
        let lists = {}
        User.findOne({email})
        .then((user)=>{
            if(!user)
                return res.status(442).json({
                    message: "Invalid User",
                    data: ""
                })
            //Remove selected recipe from likes list
            if('likes' in user){
                if(user.likes.indexOf(recipe_id) != -1){
                    user.likes = user.likes.filter(v=> v!=recipe_id);
                }
            }
            //No previous dislikes on post
            if(!('dislikes' in user)){
                user.dislikes = [];
                user.dislikes.push(recipe_id);               
                user.save();
            }
            //Previous dislikes present
            else{
                //Post to be disliked from neutral
                if(user.dislikes.indexOf(recipe_id) == -1){
                    user.dislikes.push(recipe_id);
                    user.save();
                }
                //Post earlier disliked. Move to neutral
                else{
                    user.dislikes = user.dislikes.filter(v=> v!=recipe_id);
                    user.save();
                }
            }

            return res.status(200).json({
                message: "success",
                data: {
                    likes: user.likes,
                    dislikes: user.dislikes
                }
            })
        });
    },

    //Set Favourites
    toggleFavourites: function(req,res,next){
        let {recipe_id} = req.body;
        let { email, userName } = req.user;

        User.findOne({email})
        .then((user)=>{
            if(!user)
                return res.status(442).json({
                    message: "Invalid User",
                    data: ""
                })
            //No favourites set yet    
            if(!('favourites' in user)){
                user.favourites = [];
                user.favourites.push(recipe_id);
                user.save();
            }
            //Previous favourites set
            else{
                //Selected recipe not favourited 
                if(user.favourites.indexOf(recipe_id) == -1){
                    user.favourites.push(recipe_id);
                    user.save();
                }
                //Favourited already - to be toggled to neutral
                else{
                    user.favourites = user.favourites.filter(v=> v!=recipe_id);
                    user.save();
                }
            }
            
            return res.status(200).json({
                message: "success",
                data: {
                    favourites: user.favourites
                }
            })
        });
    },
    getLikesList: function(req,res,next){
        let { email, userName } = req.user;

        User.findOne({email})
        .then((user)=>{
            if(!user)
                return res.status(442).json({
                    message: "Invalid User",
                    data: ""
                });
            return res.status(200).json({
                message: "List of likes",
                data: {likes: user.likes }
            })
        })
    },
    getFavouritesList: function(req,res,next){
        let { email, userName } = req.user;

        User.findOne({email})
        .then((user)=>{
            if(!user)
                return res.status(442).json({
                    message: "Invalid User",
                    data: ""
                });
            return res.status(200).json({
                message: "List of favourites",
                data: {likes: user.favourites }
            })
        })
    },
    getPreferenceList: function(req,res,next){
        let { email, userName } = req.user;

        User.findOne({email})
        .then((user)=>{
            if(!user)
                return res.status(442).json({
                    message: "Invalid User",
                    data: ""
                });
            return res.status(200).json({
                message: "List of preferences",
                data: {
                        likes: user.likes,
                        dislikes: user.dislikes,
                        favourites: user.favourites
                    }
            })
        })
    },

    updateProfile: function(req,res,next){
        let {userName, location, gender, mobile} = req.body;
        let objUpdate = {};
        
        //To take care of nulls in body
        if(userName) objUpdate.userName = userName;
        if(location) objUpdate.location = location;
        if(gender) objUpdate.gender = gender;
        if(mobile) objUpdate.mobile = mobile;

        let {email} = req.user;
        let userNameToSend = userName ? userName : req.user.userName;
        
        User.updateOne({email},
            {$set: objUpdate},
            (err,data)=>{
                if(err) {
                    console.log(err);
                    return res.status(500).json({
                        message: "Database Update Error",
                        data: err
                    })
                }
            });
        
        return res.status(200).json({
            message: "Profile successfully updated",
            // data: objUpdate
            data: {
                userName: userNameToSend,
                email: email,
                token: jwt.sign({
                    email: email
                }, process.env.JWT_SECRET),
                mobile: mobile,
                location: location,
                gender: gender
            }
        })
    }
}