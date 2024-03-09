const { promisify } = require('util');
const User = require('../Models/userModel');
const catchAsync = require('../utils/catchAsync');
const jwt = require('jsonwebtoken');
const AppError = require('../utils/appError');
const Email = require('../utils/email');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const signtok = (id) => {
  return jwt.sign({ id }, process.env.SECRET_KEY);
};

// signin token and sending to clint

const createSendToken = function (user, statusCode, res) {
  const token = signtok(user._id);
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIEEXPIRES * 24 * 60 * 60 * 1000,
    ),
    httpOnly: true,
  };
  if (process.env.NODE_ENV === 'production') {
    cookieOptions.secure = true;
  }
  res.cookie('jwt', token, cookieOptions);
  user.password = undefined;
  res.status(statusCode).json({
    status: 'sucess',
    token,
    data: user,
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    photo: req.body.photo,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
    role: req.body.role,
  });
  const url = `${req.protocol}://${req.get('host')}/me`;
  await new Email(newUser , url).sendWelcome();
  createSendToken(newUser._id, 200, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  // checking email and passwors
  console.log(email, password);
  if (!email || !password) {
    return next(new AppError('Please provide email and password!', 400));
  }
  //checking if user exists and password is correct
  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.correctPssword(password, user.password))) {
    return next(new AppError('input email or password not correct', 401));
  }

  //if everything is ok send token
  createSendToken(user, 200, res);
});

exports.logout = (req,res)=>{
  res.cookie('jwt' , 'Logged out' , {
    expires: new Date(Date.now() + 10*100),
    httpOnly: true
  })
  res.status(200).json({
    status: 'sucess'
  })
};

exports.protect = catchAsync(async (req, res, next) => {
  // getting token and check if its there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
    console.log(token);
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }
  if (!token) {
    return next(
      new AppError('you are not logged in please login to get access', 401),
    );
  }

  //verification token
  const decoded = await promisify(jwt.verify)(token, process.env.SECRET_KEY);
  // checking if user still exists
  const freshUser = await User.findById(decoded.id);
  if (!freshUser) {
    return next(
      new AppError('the user belonging to this token does not exists', 401),
    );
  }

  // check if user change password after token was issued
  if (freshUser.passwordChangedAfter(decoded.iat)) {
    return next(new AppError('user recently changed password', 401));
  }
  req.user = freshUser;
  next();
});

// only for checking if user is loggged in

exports.isLoggedIn = async (req, res, next) => {
  // getting token and check if its there
  // let token;
  if (req.cookies.jwt) {
    try{

    
    const decoded = await promisify(jwt.verify)(
      req.cookies.jwt,
      process.env.SECRET_KEY,
    );
    // checking if user still exists
    const freshUser = await User.findById(decoded.id);
    if (!freshUser) {
      return next();
    }

    // check if user change password after token was issued
    if (freshUser.passwordChangedAfter(decoded.iat)) {
      return next();
    }
    // there is a loggedin user
    res.locals.user = freshUser;
    return next();
  }catch(err){
    return next();
  }
  }
  next();
}

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    // roles = [admin, lead-guide]
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('you are not allowed to perform this action', 403),
      );
    }
    next();
  };
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
  // get user based on posted email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError('user with this email does not exists', 404));
  }
  // Genrate random token
  const resetToken = user.passwordResetToken();
  await user.save({ validateBeforeSave: false });

  //send to users email

  const resetUrl = `${req.protocol}://${req.get(
    'host',
  )}/api/v1/users/resetPassword/${resetToken}`;
  // const message = `Forgot your password? Submit a patch request with yours new password with patch requrst along with this token url ${reserUrl}`;
  try {
    // await Email({
    //   email: user.email,
    //   subject: 'password is valid for only 5 minutes',
    //   message,
    // });
    await new Email(user , resetUrl).passwordReset();
    res.status(200).json({
      status: 'sucess',
      message: 'token send to email',
    });
  } catch (err) {
    (user.passwordResetToken = undefined),
      (user.PasswordResetExpires = undefined),
      await user.save({ validateBeforeSave: false });
    console.log(err);
    return next(new AppError('there was an error in sending email', 500));
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  // Get user based on token
  const hashedtoken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');
  const user = await User.findOne({ PasswordResetToken: hashedtoken });
  const user2 = await User.findOne({
    PasswordResetExpires: { $gt: Date.now() },
  });
  // console.log(user)

  //if tokekn is not expired adn there is user set the passwoed
  if (!user || !user2) {
    return next(new AppError('token has expired', 400));
  }
  user.password = req.body.password;
  user.confirmPassword = req.body.confirmPassword;
  user.PasswordResetToken = undefined;
  user.PasswordResetExpires = undefined;
  user.passwordChangedAt = Date.now();
  await user.save();
  //update changepassword for user

  // log user in and send jwt
  createSendToken(user, 200, res);
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  //  1 get user from collection

  // let token = req.headers.authorization.split(' ')[1];s
  // const decoded = await promisify(jwt.verify)(token, process.env.SECRET_KEY);
  const user = await User.findById(req.user.id).select('+password');
  //check if posted current password is correct
  if (!(await user.correctPssword(req.body.password, user.password))) {
    return next(new AppError('You entered wrong password', 401));
  }
  //checking confirm password == password
  if (!(req.body.updatePassword === req.body.confirmUpdatePassword)) {
    return next(
      new AppError('password and confirm password not matched ', 400),
    );
  }
  //if so update password
  user.password = req.body.updatePassword;
  user.confirmPassword = req.body.confirmUpdatePassword;
  await user.save();
  createSendToken(user, 200, res);
});
