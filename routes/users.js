var express = require('express');
var router = express.Router();
var {
    profile: profileController,
    toggleLike: toggleLikeController,
    toggleDislike: toggleDislikeController,
    toggleFavourites: toggleFavouritesController,
    getLikesList: getLikesListController,
    getFavouritesList: getFavouritesListController,
    getPreferenceList: getPreferenceListController,
    updateProfile: updateProfileController,
    userList: userListController,
    getUserComments: getUserCommentsController,
    addComment: addCommentController,
    getUserFriendsDetails: getUserFriendsDetailsController,
    getUserSentRequests: getUserSentRequestsController,
    getUserPendingRequests: getUserPendingRequestsController
} = require('./../controllers/users')

var authenticate = require('./../services/authentication')

/**
 * @api {post} /profile Request Profile View
 * @apiName Profile View
 * @apiGroup Users
 *
 * @apiSuccess {String} message Profile Data
 * @apiSuccess {String} data {userName, email, mobile, location, gender}
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
          message: "Profile Data",
          data: {
            userName: userName,
            email: email,
            mobile: String,
            location: String,
            gender: String
          }
 *     }
 *
 * @apiError AuthenticationError Code 442 Token Error
 * @apiError AuthenticationError Code 442 Invalid User
 *         
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 442 Authentication Error
 *     {
 *       "message": "Invalid User"
 *     }
 */
router.post('/profile',authenticate,profileController);

/**
 * @api {post} /updateProfile Update profile data
 * @apiName Update user's profile data
 * @apiGroup Users
 *
 * @apiParam {String} userName Full Name of user
 * @apiParam {String} location Location
 * @apiParam {String} gender Male/Female/Others (Any string)
 * @apiParam {String} mobile Mobile number (no checks)
 * 
 * @apiSuccess {String} message Profile successfully updated
 * @apiSuccess {String} data Only fields which are changed(except username) {userName:String, email: String, token, "mobile":String, "location":String, "gender":String}
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
          message: "Profile successfully updated",
          data: {
                    userName: <String>,
                    email: <String>,
                    token: jwt String of user data,
                    mobile: String,
                    location: String,
                    gender: String
                }
 *     }
 *
 * @apiError AuthenticationError Code 442 Token Error
 * @apiError DatabaseError Code 500 Database Update Error
 * 
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 442 Authentication Error
 *     {
 *       "message": "Token error",
 *        "data": ""
 *     }
 */
router.post('/updateProfile',authenticate,updateProfileController);

/**
 * @api {post} /toggleLike Like or Remove like from a recipe
 * @apiName Toggle like
 * @apiGroup Users
 *
 * @apiParam {String} recipe_id Recipe ID to toggle Like status
 * 
 * @apiSuccess {String} message success
 * @apiSuccess {String} data
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
          message: "success",
          data: {
                    likes: [Array of liked recipes],
                    dislikes: [Array of disliked recipes]
                }
 *     }
 *
 * @apiError AuthenticationError Code 442 Token Error
 * @apiError AuthenticationError Code 442 Invalid User
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 442 Authentication Error
 *     {
 *       "message": "Invalid User",
 *        "data": ""
 *     }
 */
router.post('/toggleLike',authenticate,toggleLikeController);


/**
 * @api {post} /toggleDisike Dislike or remove dislike from a recipe
 * @apiName Toggle Dislike
 * @apiGroup Users
 *
 * @apiParam {String} recipe_id Recipe ID to toggle Like status
 * 
 * @apiSuccess {String} message success
 * @apiSuccess {String} data
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
          message: "success",
          data: {
                    likes: [Array of liked recipes],
                    dislikes: [Array of disliked recipes]
                }
 *     }
 *
 * @apiError AuthenticationError Code 442 Token Error
 * @apiError AuthenticationError Code 442 Invalid User
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 442 Authentication Error
 *     {
 *       "message": "Invalid User",
 *        "data": ""
 *     }
 */
router.post('/toggleDislike',authenticate,toggleDislikeController);

/**
 * @api {post} /toggleFavourites Toggle addition/removal from favourites
 * @apiName Toggle favourites
 * @apiGroup Users
 *
 * @apiParam {String} recipe_id Recipe ID to toggle Like status
 * 
 * @apiSuccess {String} message success
 * @apiSuccess {String} data
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
          message: "success",
          data: {
                    favourites: [Array of favourited recipes]
                }
 *     }
 *
 * @apiError AuthenticationError Code 442 Token Error
 * @apiError AuthenticationError Code 442 Invalid User
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 442 Authentication Error
 *     {
 *       "message": "Invalid User",
 *        "data": ""
 *     }
 */
router.post('/toggleFavourites',authenticate,toggleFavouritesController);

/**
 * @api {post} /getLikesList Retrieve list of liked posts
 * @apiName Retrieve list of likes
 * @apiGroup Users
 *
 * @apiSuccess {String} message List of likes
 * @apiSuccess {String} data {"likes":[<Array of recipe ids>]}
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
          message: "List of likes",
          data: {likes: [String]}
 *     }
 *
 * @apiError AuthenticationError Code 442 Token Error
 * @apiError AuthenticationError Code 442 Invalid User
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 442 Authentication Error
 *     {
 *       "message": "Invalid User",
 *        "data": ""
 *     }
 */
router.post('/getLikesList',authenticate,getLikesListController);

/**
 * @api {post} /getFavouritesList Retrieve list of favourited posts
 * @apiName Retrieve list of favourites
 * @apiGroup Users
 *
 * @apiSuccess {String} message List of favourites
 * @apiSuccess {String} data {"favourites":[<Array of recipe ids>]}
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
          message: "List of favourites",
          data: {favourites: [String]}
 *     }
 *
 * @apiError AuthenticationError Code 442 Token Error
 * @apiError AuthenticationError Code 442 Invalid User
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 442 Authentication Error
 *     {
 *       "message": "Invalid User",
 *        "data": ""
 *     }
 */
router.post('/getFavouritesList',authenticate,getFavouritesListController);

/**
 * @api {post} /getPreferenceList Retrieve list of preferences posts
 * @apiName Retrieve list of preferences
 * @apiGroup Users
 *
 * @apiSuccess {String} message List of preferences
 * @apiSuccess {String} data {"likes":[<Array of recipe ids>], "dislikes":[<Array of recipe ids>], "favourites":[<Array of recipe ids>]}
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
          message: "List of preferences",
          data: {
            "likes":[<Array of recipe ids>], 
            "dislikes":[<Array of recipe ids>], 
            "favourites":[<Array of recipe ids>]
          }
 *     }
 *
 * @apiError AuthenticationError Code 442 Token Error
 * @apiError AuthenticationError Code 442 Invalid User
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 442 Authentication Error
 *     {
 *       "message": "Invalid User",
 *        "data": ""
 *     }
 */
router.post('/getPreferenceList',authenticate,getPreferenceListController);

/**
 * @api {post} /getUserComments Retrieve list of comments and privacy
 * @apiName Retrieve list of comments and privacy
 * @apiGroup Users
 *
 * @apiSuccess {String} message List of comments
 * @apiSuccess {String} data {"comments":[{ userId: String, text: String, timeStamp: Date, privacy: Number }]}
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
          message: "List of comments",
          data: {comments: [{ userId: String, text: String, timeStamp: Date, privacy: Number }]}
 *     }
 *
 * @apiError AuthenticationError Code 442 Token Error
 * @apiError AuthenticationError Code 442 Invalid User
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 442 Authentication Error
 *     {
 *       "message": "Invalid User",
 *        "data": ""
 *     }
 */

router.get('/userList',authenticate,userListController);

router.post('/getUserComments',authenticate,getUserCommentsController);

router.post('/addComment',authenticate,addCommentController);

router.post('/getUserFriendsDetails',authenticate,getUserFriendsDetailsController);
router.post('/getUserSentRequests',authenticate,getUserSentRequestsController);
router.post('/getUserPendingRequests',authenticate,getUserPendingRequestsController);

module.exports = router;
