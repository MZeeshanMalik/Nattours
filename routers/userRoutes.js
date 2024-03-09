const express = require('express');
const fs = require('fs');
const { Module } = require('module');
const router = express.Router();
const path = require('path');
const userController = require('./../controller/userConteroller');
const authController = require('./../controller/authenticationController');
const reviewController = require('./../controller/reviewController');

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/logout', authController.logout);
router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);
router.use(authController.protect);
router.patch('/updateMe', userController.uploadUserPhoto,userController.resizeUserPhoto, authController.protect, userController.updateMe);
router.delete('/deleteMe', authController.protect, userController.deleteMe);
router
  .route('/me')
  .get( userController.getMe, userController.getUser);
  // .post(userController.createNewuser);
  router
  .route('/updatePassword')
  .patch( authController.updatePassword);
  router.use(authController.restrictTo('admin'))
  router.route('/').get(userController.getAllusers);     
router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
