var express = require('express');
var router = express.Router();
var {
    profile: profileController,
    toggleLike: toggleLikeController,
    toggleDislike: toggleDislikeController,
    toggleFavourites: toggleFavouritesController,
    getLikesList: getLikesListController,
    getFavouritesList: getFavouritesListController 
} = require('./../controllers/users')

var authenticate = require('./../services/authentication')

/**
 * @api {post} /profile Request Profile View
 * @apiName Profile View
 * @apiGroup Users
 *
 * @apiSuccess {String} message Profile Data
 * @apiSuccess {String} data {userName, email}
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
          message: "Profile Data",
          data: {
            userName: userName,
            email: email
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
 * @api {post} /toggleLike Like or Remove like from a recipe
 * @apiName Toggle Dislike
 * @apiGroup Users
 *
 * @apiParam {String} recipe_id Recipe ID to toggle Like status
 * 
 * @apiSuccess {String} message Like set
 * @apiSuccess {String} data
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
          message: "Like Set",
          data: ""
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
 * @apiSuccess {String} message Dislike set
 * @apiSuccess {String} data
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
          message: "Dislike Set",
          data: ""
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
 * @apiSuccess {String} message Favourite set
 * @apiSuccess {String} data
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
          message: "Favourite set",
          data: ""
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

module.exports = router;
