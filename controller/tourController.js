const fs = require('fs');
const path = require('path');
const { message } = require('statuses');
const Tour = require('./../Models/toursmodel');
const { query } = require('express');
var mongoose = require('mongoose');
const { ok } = require('assert');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const handleFactory = require('./handleFactory')
const multer = require('multer');
const sharp = require('sharp');

const multerstorage = multer.memoryStorage();
const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(
      new AppError(
        'uploaded file is not an image please upload an image file',
        400,
      ),
      false,
    );
  }
};
const upload = multer({
  storage: multerstorage,
  fileFilter: multerFilter,
});

exports.uploadTourImages = upload.fields([
  {name: 'imageCover' , maxCount: 1},
  {name: 'images' , maxCount: 3},
])

exports.alliasTours = (req, res, next) => {
  req.query.sort = '-ratingsAverage';
  req.query.limit = '3';
  req.query.fields = 'ratingsAverage,price,id';
  next();
};
exports.getAlltours = handleFactory.getAll(Tour)
exports.getTourbyid = handleFactory.getOne(Tour , {
  path: 'reviews',
  select: 'review'
});
exports.addingTour = handleFactory.createOne(Tour);
exports.updateTour = handleFactory.updateOne(Tour);
exports.deleteTour = handleFactory.deleteOne(Tour);
exports.tourStatstics = catchAsync(async (req, res,next) => {
  const stats = await Tour.aggregate([
    {
      $match: { ratingsAverage: { $gte: 4.5 } },
    },
    {
      $group: {
        _id: '$difficulty',
        numTours: { $sum: 1 },
        numRatings: { $sum: '$ratingsQuantity' },
        avgRating: { $avg: '$ratingsAverage' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' },
      },
    },
  ]);

  res.status(200).json({
    status: 'sucess',
    data: stats,
  });
});

exports.getMonthlyPlan = catchAsync(async (req, res,next) => {
  const year = req.params.year * 1;
  const plan = await Tour.aggregate([
    {
      $unwind: "$startDates",
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { $month: '$startDates' },
        numTourStarts: { $sum: 1 },
        tours: { $push: '$name' },
        // id: {$push: '$id'}
      },
    },
    {
      $addFields: { month: '$_id' },
    },
    {
      $project: {
        _id: 0,
      },
    },
    {
      $sort: { numTourStarts: -1 },
    },
  ]);
  res.status(200).json({
    length: plan.length,
    status: 'sucess',
    data: plan,
  });
});
// /tours-within/:distance/center/:latlng/unit/:unit'
exports.getToursWithin = catchAsync(async(req, res, next)=>{
  const { distance, latlng , unit} = req.params;
 const [lat , lng] = latlng.split(',');
 const radius = unit=== 'mi'? distance/3963.2 : distance/6378.1
  if(!lat || !lng){
  next(new AppError('please provide in format lat longitude' , 400))
 }
 const tour = await Tour.find({
  startLocation: {$geoWithin: {$centerSphere: [[lng , lat],radius]}}
 });
 console.log(distance , latlng, unit)
 res.status(200).json({
  status:'sucess',
  results: tour.length,
  data: {
    data: tour
  }
 })
});
exports.getDistance = catchAsync(async(req, res, next)=>{
  const { latlng , unit} = req.params;
 const [lat , lng] = latlng.split(',');
 const multiplier = unit==='mi' ? 0.000621371 : 0.001
  if(!lat || !lng){
  next(new AppError('please provide in format lat longitude' , 400))
}
const distances = await Tour.aggregate([
    {
      $geoNear: {
        near:{
          type:'point',
          coordinates: [lng*1 , lat*1]
        },
        distanceField: 'distance',
        distanceMultiplier: multiplier
      }
    },
    {
      $project:{
        name: 1,
        distance: 1
      }
    }
])
res.status(200).json({
  status:'sucess',
  data: {
    data: distances
  }
 })
})
