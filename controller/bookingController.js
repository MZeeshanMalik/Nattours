const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const handleFactory = require('./handleFactory')
const express = require('express');
const Tour = require('./../Models/toursmodel');
// const bookingController = require('../controller/bookingController');
const authController = require('../controller/authenticationController');



exports.getCheckoutSession = catchAsync(async (req,res,next)=>{
    //1 get the booked tour by id
    const tour = await Tour.findById(req.params.tourID);
    //2 create checkout session
   const session = await stripe.checkout.sessions.create({
        payment_method_types: [card],
        sucess_url: `${req.protocol}://${req.get('host')}/`,
        cancel_url: `${req.protocol}://${req.get('host')}/tour/${tour.slug}`,
        customer_Email: req.user.email,
        clint_Refrence_id: req.user.tourID,
        line_items: [
            {
                name: `${tour.name} Tour`,
                description: tour.summary,
                amount: tour.price *100,
                curreency: 'usd',
                quantity: 1
            }
        ]
    })
    //3 create session as response
    res.status(200).json({
        status: 'success',
        session
    })
});