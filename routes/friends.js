var express = require('express');
var router = express.Router();
var {
    getFriendProfile: getFriendProfileController,
    getFriendComments: getFriendCommentsController,
    sendRequest: sendRequestController,
    acceptRequest: acceptRequestController,
    rejectRequest: rejectRequestController
} = require('./../controllers/friends')

var authenticate = require('./../services/authentication');

router.post('/getFriendProfile',authenticate,getFriendProfileController);

router.post('/getFriendComments',authenticate,getFriendCommentsController);

router.post('/sendRequest',authenticate,sendRequestController);

router.post('/acceptRequest',authenticate,acceptRequestController);

router.post('/rejectRequest',authenticate,rejectRequestController);

module.exports = router;
