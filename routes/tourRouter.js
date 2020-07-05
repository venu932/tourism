const express = require('express');
const tourController = require('../controller/tourController');
const authController = require('../controller/authController');

const reviewRouter = require('./reviewRouter');

const router = express.Router();

// Nested Routes with Express
router.use('/:tourId/reviews', reviewRouter); // the same on app.js ~> routes

router.route('/tour-stats').get(tourController.getTourStats);

router
  .route('/monthly-plan/:year')
  .get(
    authController.protect,
    authController.restrictTo('tulanh', 'lead-guide', 'guide'),
    tourController.getMonthlyPlan
  );

router
  .route('/top-five-tours')
  // to avoid conflix with route('/:id'), place this router above router /:id
  .get(tourController.aliasTopFiveTours, tourController.getAllTours);

router
  .route('/')
  .get(tourController.getAllTours)
  // .get(authController.protect, tourController.getAllTours)
  .post(
    authController.protect,
    authController.restrictTo('tulanh', 'lead-guide'),
    tourController.createTour
  );

router
  .route('/:slug')
  .get(authController.protect, tourController.getTour)
  .patch(authController.protect, tourController.updateTour)
  .delete(
    authController.protect,
    authController.restrictTo('tulanh', 'leadGuide'),
    tourController.deleteTour
  );

module.exports = router;