var Campground = require("../models/campground");
var Comment = require("../models/comment");
// all the middleware goes here
var middlewareObj = {};

middlewareObj.checkCampgroundOwnership = function(req, res, next){
    if(req.isAuthenticated()){
        Campground.findById(req.params.id, function(err, foundCampground){
            if(err){
                req.flash("error", "Campground not found");
                res.redirect("back");
            } else {
                // does the user own the campground
            if(foundCampground.author.id.equals(req.user._id)) { // have to do .equals because req.user._id is a string and found.author is a mongoose object
               next();
            } else {
                req.flash("error", "You dont have permission to do that.");
                res.redirect("back");
              }
            }
        });
    } else {
        req.flash("error", "You need to be logged in to do that.");
        res.redirect("back");
    }
}

middlewareObj.checkCommentOwnership = function(req, res, next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if(err){
                res.redirect("back");
            } else {
                // does the user own the comment?
            if(foundComment.author.id.equals(req.user._id)) { // have to do .equals because req.user._id is a string and found.author is a mongoose object
               next();
            } else {
                req.flash("error", "You dont have permission to do that.");
                res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "You need to be logged in to do that.");
        res.redirect("back");
    }
}

//middleware - can also use this anywhere, if we wanted a user to be signed in to access any page at at. Just need to place this wherever routes u want to use it in.
middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "You need to be logged in to do that.");
    res.redirect("/login");
};


module.exports = middlewareObj;
