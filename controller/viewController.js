const Tour = require('../Models/toursmodel');
const User = require('../Models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const slugify = require('slugify');
exports.overview = catchAsync(async (req, res, next) => {
  // 1: get the tour data from collection
  const tours = await Tour.find();
  res.status(200).render('overview', {
    title: 'all tours',
    tours,
  });
});
exports.tourdetail = catchAsync(async (req, res, next) => {
  const tour = await Tour.findOne({ slug: req.params.tourname }).populate({
    path: 'reviews',
    fields: 'review rating user',
  });
  if (!tour) {
    return next(new AppError('There is no tour with this name', 404));
  }
  res.status(200).render('tour', {
    title: tour.name,
    tour: tour,
  });
});

exports.getLoginForm = (req, res) => {
  res.status(200).render('login', {
    title: 'Login your account',
  });
};

exports.getAccount = (req, res) => {
  res.status(200).render('account', {
    title: 'Your account',
  });
};

exports.updateUserData = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user.id,
    {
      name: req.body.name,
      email: req.body.email,
    },
    {
      new: true,
      runValidators: true,
    },
  );
  
    res.status(200).render('account', {
      title: 'Your account',
      user: user,
    });
    // console.log('helo woedld' , req.body)
});
