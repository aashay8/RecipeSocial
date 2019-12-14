
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
        console.log(`${email}     ${userName}`)
            return res.status(200).json({
                message: "Profile Data",
                data: {
                    userName: userName,
                    email: email
                }
            });
        
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
            if(Object.keys(user).indexOf('likes') == -1){
                user.likes = [];
                user.likes.push(recipe_id);
                //Remove from dislikes
                if(Object.keys(user).indexOf('dislikes') != -1){
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
                    if(Object.keys(user).indexOf('dislikes') != -1){
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
                message: "Like set",
                data: ''
            })
        });
    },

    //Set dislike on recipe
    toggleDislike: function(req,res,next){
        let {recipe_id} = req.body;
        let { email, userName } = req.user;

        User.findOne({email})
        .then((user)=>{
            if(!user)
                return res.status(442).json({
                    message: "Invalid User",
                    data: ""
                })

                if(Object.keys(user).indexOf('likes') != -1){
                    if(user.likes.indexOf(recipe_id) != -1){
                        user.likes = user.likes.filter(v=> v!=recipe_id);
                    }
            //No previous dislikes on post
            if(Object.keys(user).indexOf('dislikes') == -1){
                user.dislikes = [];
                user.dislikes.push(recipe_id);               
                }
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
                message: "Dislike set",
                data: ''
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
            if(Object.keys(user).indexOf('favourites') == -1){
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
                message: "Favourite set",
                data: ''
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
    }
    // getProfileDetails: function(req,res,next){
    //     let { email } = req.headers.token;

    //     User.findOne({email: email}).then((user)=>{
    //         if(!user)
    //             return res.status(442).json({
    //                 message: "Invalid User",
    //                 data: ""
    //             });
    //         return res.status(200).json({
    //             message: "List of likes",
    //             data: {likes: user.likes }
    //         })
    //     })
    // },
}