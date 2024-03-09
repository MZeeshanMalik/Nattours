const Review = require('../Models/rewiew')
const catchAsync = require('../utils/catchAsync')
const handleFactory = require('./handleFactory')

exports.getAllReviews = handleFactory.getAll(Review)
// Creating new review
exports.setReviewIds = (req,res,next)=>{
    //allow nested routes
    if(!req.body.tour) req.body.tour = req.params.tourid
    if(!req.body.user) req.body.user = req.user.id;
    next();
}
exports.addingReview = handleFactory.createOne(Review)
exports.deleteReview = handleFactory.deleteOne(Review);
exports.updateReview = handleFactory.updateOne(Review);
exports.getReview = handleFactory.getOne(Review);
