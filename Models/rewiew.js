const mongoose = require('mongoose');
const Tour = require('./toursmodel')
// const User = require('./usermodel')
//review , reatting , created at , ref to tour , ref to user
const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      minlength: [5, 'minimum length should be 5'],
      maxlength: [100, 'review max length is 100'],
      required: true,
    },
    rating: {
      type: Number,
      minlength: [1, 'minimum length should be 1'],
      maxlength: [5, 'review max length is 5'],
    },
    createdAt: {
      type: Date,
      date: Date.now(),
    },
    tour:[
      {
        type: mongoose.Schema.ObjectId,
        ref: 'Tour',
        required: [true, 'Review must belong to a tour'],
      },
    ],
    user: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'review must belong to a user'],
      },
    ],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);
// reviewSchema.index({tour:1}, {unique: true})
reviewSchema.pre(/^find/, function (next) {
  // this.populate({
  //   path: 'tour',
  //   select: 'name',
  // })
  this.populate({
    path: 'user',
    select: 'name photo'
  });
  next();
});
reviewSchema.statics.calcRatingAvg = async function(tourid){
  const stats = await this.aggregate([
  {
    $match : {tour: tourid}
  },
  {
    $group: {
      _id: '$tour',
      nRating: {$sum: 1},
      avgRatng: {$avg: '$rating'}
    },
  }
])
if(stats.length>0){
  await Tour.findByIdAndUpdate(tourid ,  {
    ratingsAverage: stats[0].avgRatng,
    ratingsQuantity: stats[0].nRating
  })
}else{
  await Tour.findByIdAndUpdate(tourid , {
    ratingsAverage: 4.5,
    ratingsQuantity: 0
  })
}
};
reviewSchema.post('save' , function(){
  // this point to current review
  this.constructor.calcRatingAvg(this.tour);
});
reviewSchema.pre( /^findOneAnd/, async function(next){
this.r = await this.findOne().clone(); 
// console.log(this.r)
next();
});
reviewSchema.post( /^findOneAnd/, async function(){
 await this.r.constructor.calcRatingAvg(this.r.tour)
});
const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;
