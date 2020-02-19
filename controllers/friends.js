require('dotenv').config();
var path = require('path')
var jwt = require('jsonwebtoken');
var User = require('./../models/Users');
var Comments = require('./../models/Comments');

module.exports = {
    getFriendProfile: function (req, res, next) {
        let { friendId } = req.body;
        let { email } = req.user;
        if (friendId == email)
            return res.status(442).json({
                message: "Invalid credentials",
                data: ""
            });
        User.findOne({ email, isVerified: true })
            .then(user => {
                if (!user)
                    return res.status(442).json({
                        message: "Invalid User",
                        data: ""
                    })
                User.findOne({ email: friendId, isVerified: true })
                    .then(friend => {
                        if (!friend)
                            return res.status(442).json({
                                message: "Invalid friend id",
                                data: ""
                            })

                        if (user.friendsList.indexOf(friendId) != -1) {
                            //User is already friends with profile being visited
                            return res.status(200).json({
                                message: "Friend details",
                                data: {
                                    userName: friend.userName,
                                    email: friend.email,
                                    location: friend.location,
                                    gender: friend.gender,
                                    mobile: friend.mobile,
                                    likes: friend.likes,
                                    dislikes: friend.dislikes,
                                    favourites: friend.favourites
                                }
                            })
                        }
                        else if (user.sentRequestList.indexOf(friendId) != -1) {
                            //Friend request has been sent from logged in user to visited profile - currently unaccepted
                            return res.status(200).json({
                                message: "Friend Request sent",
                                data: { userName: friend.userName }
                            })
                        }
                        else if (user.pendingRequestList.indexOf(friendId) != -1) {
                            //Friend request received from visited profile, currently unaccepted
                            return res.status(200).json({
                                message: "Pending Friend Request",
                                data: { userName: friend.userName }
                            })
                        }
                        else
                            //Not connected yet
                            return res.status(200).json({
                                message: "Not connected",
                                data: { userName: friend.userName }
                            })
                    })
            })
    },

    getFriendComments: function (req, res, next) {
        let { email } = req.user;
        let { recipe_id, friendId } = req.body;
        if (friendId == email)
            return res.status(442).json({
                message: "Invalid credentials",
                data: ""
            });
        Comments.findOne({ userID: friendId, recipe_id })
            .then(comment => {
                if (!comment)
                    return res.status(442).json({
                        message: "No comments for this recipe found",
                        data: ""
                    });
                return res.status(200).json({
                    message: "List of comments",
                    data: {
                        commentsList: comment.commentsData.filter(v => v.privacy == 0)
                    }
                })
            })
    },

    //add comment, use '/users' API

    sendRequest: function (req, res, next) {
        let { friendId } = req.body;
        let { email } = req.user;
        if (friendId == email)
            return res.status(442).json({
                message: "Invalid credentials",
                data: ""
            });
        User.find({ email: { $in: [email, friendId] } })
            .then((records) => {
                if (!records || records.length > 2)
                    return res.status(442).json({
                        message: "Invalid credentials",
                        data: ""
                    });
                for (let i in records) {
                    if (records[i].email == email) {
                        records[i].sentRequestList.push(friendId);
                        records[i].save();
                    }
                    else {
                        records[i].pendingRequestList.push(email);
                        records[i].save();
                    }
                }
                return res.status(200).json({
                    message: "Friend request sent",
                    data: ""
                });
            });
    },

    acceptRequest: function (req, res, next) {
        let { friendId } = req.body;
        let { email } = req.user;
        if (friendId == email)
            return res.status(442).json({
                message: "Invalid credentials",
                data: ""
            });
        User.find({ email: { $in: [email, friendId] } })
            .then((records) => {
                if (!records || records.length > 2)
                    return res.status(442).json({
                        message: "Invalid credentials",
                        data: ""
                    });

                for (let i in records) {
                    if (records[i].email == email) {
                        records[i].friendsList.push(friendId);
                        let indexInPendingList = records[i].pendingRequestList.indexOf(friendId);
                        if (indexInPendingList == -1)
                            return res.status(442).json({
                                message: "Invalid credentials",
                                data: ""
                            });
                        records[i].pendingRequestList.splice(indexInPendingList, 1)
                        records[i].save();
                    }
                    else {
                        records[i].friendsList.push(email);
                        let indexInSentList = records[i].sentRequestList.indexOf(email);
                        if (indexInSentList == -1)
                            return res.status(442).json({
                                message: "Invalid credentials",
                                data: ""
                            });
                        records[i].sentRequestList.splice(indexInSentList, 1)
                        records[i].save();
                    }
                }
                return res.status(200).json({
                    message: "Request accepted",
                    data: ""
                })
            })
    },

    rejectRequest: function (req, res, next) {
        let { friendId } = req.body;
        let { email } = req.user;
        if (friendId == email)
            return res.status(442).json({
                message: "Invalid credentials",
                data: ""
            });
        User.find({ email: { $in: [email, friendId] } })
            .then((records) => {
                if (!records || records.length > 2)
                    return res.status(442).json({
                        message: "Invalid credentials",
                        data: ""
                    });

                for (let i in records) {
                    if (records[i].email == email) {
                        let indexInPendingList = records[i].pendingRequestList.indexOf(friendId);
                        if (indexInPendingList == -1)
                            return res.status(442).json({
                                message: "Invalid credentials",
                                data: ""
                            });
                        records[i].pendingRequestList.splice(indexInPendingList, 1)
                        records[i].save();
                    }
                    else {
                        let indexInSentList = records[i].sentRequestList.indexOf(email);
                        if (indexInSentList == -1)
                            return res.status(442).json({
                                message: "Invalid credentials",
                                data: ""
                            });
                        records[i].sentRequestList.splice(indexInSentList, 1)
                        records[i].save();
                    }
                }
                return res.status(200).json({
                    message: "Request rejected",
                    data: ""
                })
            })
    },


}