const express = require('express');
const bookingController = require('../controller/bookingController');
const authController = require('../controller/authenticationController');
const router = express.Router();
console.log('hi')
router.get('/checkout-session:/tourID' , authController.protect , bookingController.getCheckoutSession)

module.exports = router;