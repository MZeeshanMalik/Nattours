const mongoose = require('mongoose');
const slugify = require('slugify');
// const User = require('./rewiew')
const Review = require('./rewiew')
// const validator = require('validator');

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'tour must have a name'],
      unique: [true, 'name should be unique'],
      maxlength: [40 , 'The length should be less than 40s'],
      minlength: [3 , 'The length should be greater than 10']
    },
    slug: String,
    duration: {
      type: Number,
      required: [true, 'A tour must have a duration'],

    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A Tour must have group size'],
    },
    difficulty: {
      type: String,
      required: [true, 'A tour must have difficulty'],
      enum: {
        values: ['easy' , 'medium' , 'difficult'],
        message: 'only easy medium and difficult values are allowed'
      }
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1   , 'rating should be minimum 1'],
      max: [5   , 'rating should be maximum 5.0'],
      set:val=> Math.round(val*10)/10
    },
    price: {
      type: Number,
      required: [true, 'price must be mentioned'],
    },
    discountprice: {
      type: Number,
      // this only points to only new created document not on updating
      validate : {
        validator : function(val){
          return val<this.price    // 200 - 100 = true
        },
        message: 'discount cannott be greater than price '
      }
    },
    summary: {
      type: String,
      trim: true,
      required: [true, 'it is required'],
    }, 
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
    },
    images: [String],
    createdat: {
      type: Date,
      default: Date.now(),
    },
    startDates: [Date],
    secretour : {
      type: Boolean,
      default: false
    },
    startLocation: {
      //GeoJson
      type:{
        type: String,
        default: 'Point',
        enum: ['Point']
      },
      coordinates: [Number],
      address: String,
      description: String
    },
    locations: [
      {
        //GeoJson
        type:{
          type: String,
          default: 'Point',
          enum: ['Point']
        },
        coordinated: [Number],
        address: String,
        description: String
      }
    ],
    // guides: Array,
    // thiis is used to refrence the user by mongoose id
    guides: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
      }
    ]
  },
  
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);
//indexing documents to read efficiently
tourSchema.index({price: -1, ratingsAverage: 1})
tourSchema.index({slug: 1})
tourSchema.index({startLocation: '2dsphere'});
// virtual populate
tourSchema.virtual('reviews', {
  ref: 'Review' , 
  foreignField: 'tour',
  localField: '_id'
});
// tourSchema.virtual('durationWeeks').get(function () {
//   return this.duration / 7;
// });
tourSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

tourSchema.pre(/^find/ , function(next){
    this.find({secretour: {$ne : true}})
    this.start = Date.now()
  next();
});

tourSchema.pre(/^find/ , function(next){
  this.populate({
    path:'guides',
    select: "-__v -passwordChangeAt"
  });
  next()
});
// this middleware is used to embedd documents in an object
// tourSchema.pre('save' , async function(next){
//   const guidesPromises = await this.guides.map(id=>User.findById(id))

//   this.guides = await Promise.all(guidesPromises)
  
//   next()
// })
tourSchema.post(/^find/ , function(docs , next){
  console.log(`the query took ${Date.now() - this.start} miliseconds`)
  next()
})


// Aggragation middleware
// tourSchema.pre('aggregate', function(next){
//   this.pipeline().unshift({$match:{secretour : {$ne : true}}})
//   next()
// })

const Tour = mongoose.model('Tour', tourSchema);
module.exports = Tour;
