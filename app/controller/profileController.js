/**
 The profileController.js exposes methods regarding the profile view.

 @module Server_Controller.js
 @class Server_Controller_profileController.js
 **/

// module dependencies
var model = require("../model"),
    utils = require("../../utils");

/**
 Render the profile view, regardless whether it is user's own profile or an other.

 @param req
 @param res
 @method getProfile
 **/
exports.getProfile = function(req, res) {

    // get userId from QueryString
    var userId = req.query.userId;

    // if QueryString doesn't provide a userId, redirect to own profile
    if (userId === undefined) {
        return res.redirect("/profile?userId=" + req.session.user._id);
    }

    // only proceed if the userId is a valid number
    if (!isNaN(userId)) {
        // query user from database (own profile should not be fetched from session, because messages may miss!)
        model.UserModel.findOne({"_id" : userId}, function(error, user) {
            if (error) {
                console.log("Error in database! " + error);

                // no such user exist, redirect with an error message to user's own profile
                req.session.profile_error = "A user with the id of " + userId + " doesn't exist.";
                return res.redirect("/profile?userId=" + req.session.user._id);
            }
            else if (!user) {
                console.log("User not found in database! " + error);

                // no such user exist, redirect with an error message to user's own profile
                req.session.profile_error = "A user with the id of " + userId + " doesn't exist.";
                return res.redirect("/profile?userId=" + req.session.user._id);
            }
            else {
                // save the visited userId in session (needed when sending a corkboard message)
                req.session.last_visited_profileId = userId;

                // determine whether it is user's own profile or not
                var ownProfile = (userId == req.session.user._id);

                // determine friend status
                var hasPendingFriendRequest = utils.inArray(user.pendingFriendRequests, "_id", req.session.user._id),
                    isAlreadyFriends = utils.inArray(user.friends, "_id", req.session.user._id),
                    friendStatus = "unknown";

                if (hasPendingFriendRequest) {
                    friendStatus = "pending";
                }
                if (isAlreadyFriends) {
                    friendStatus = "friends";
                }

                // render profile view
                return res.render(
                    // view to render
                    'profile',

                    // data send
                    {
                        title : ownProfile ? "Your Profile" : user.first_name + "'s Profile",
                        ownProfile : ownProfile,
                        user : utils.formatMessages(user),
                        placeholder : ownProfile ? "What are you doing? Let people know!" :  "Leave " + user.first_name + " a message",
                        friendStatus : friendStatus,
                        error : req.session.profile_error
                    },

                    // callback: resetting error and send html (view)
                    function(error, html) {
                        if (error) {
                            console.log("Profile view couldn't be displayed. " + error);
                        }
                        else {
                            req.session.profile_error = null;
                            res.send(html);
                        }
                    }
                );
            }
        });
    }
    else {
        console.log("The userId is not a number!");

        // no such user exist, redirect with an error message to user's own profile
        req.session.profile_error = "The userId " + userId + " is not a number.";
        return res.redirect("/profile?userId=" + req.session.user._id);
    }
};