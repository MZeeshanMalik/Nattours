const express = require('express');
const fs = require('fs');
const { Module } = require('module');
const path = require('path');
const router = express.Router();
const controller = require('./../controller/tourController');
const authcontroller = require('./../controller/authenticationController');
const reviewController = require('./../controller/reviewController');
const reviewRoute = require('./reviewRoutes');

// router.param('id', controller.checkId);
// router.param('id', controller.checkBody);
router
  .route('/top-5-cheaptours')
  .get(controller.alliasTours, controller.getAlltours);
router
  .route('/getmonthlyPaln/:year')
  .get(
    authcontroller.protect,
    authcontroller.restrictTo('admin', 'lead-guide', 'guides'),
    controller.getMonthlyPlan,
  );
//geospatial queries
router
  .route('/tours-within/:distance/center/:latlng/unit/:unit')
  .get(controller.getToursWithin);
router.route('/distance/:latlng/unit/:unit').get(controller.getDistance);
router.route('/tour-stats').get(controller.tourStatstics);
router.route('/').get(controller.getAlltours).post(
  // authcontroller.protect,
  // authcontroller.restrictTo('admin', 'lead-guide'),
  controller.addingTour,
);
router.route('/:id').get(controller.getTourbyid);
router
  .route('/:id')
  .patch(
    authcontroller.protect,
    authcontroller.restrictTo('admin', 'lead-guide'),
    controller.updateTour,
  );
router
  .route('/:id')
  .delete(
    authcontroller.protect,
    authcontroller.restrictTo('admin', 'lead-guide'),
    controller.deleteTour,
  );

// post/tour/2324/reviews
//  router.route('/:tourid/reviews').post(authcontroller.protect , authcontroller.restrictTo('user')
//  , reviewController.addingReview)
router.use('/:tourid/reviews', reviewRoute);

module.exports = router;
