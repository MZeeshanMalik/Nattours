const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const User = require('../Models/userModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const handleFactory = require('./handleFactory');
const multer = require('multer');

// const multerstorage = multer.diskStorage({
//   destination: (req, file, cb)=>{
//     cb(null ,  'public/img/users')
//   },
//   filename: (req, file, cb)=>{
//     const ext = file.mimetype.split('/')[1];
//     // console.log(req.user)
//     const name= `user-${req.user.id}-${Date.now()}.${ext}`;
//     console.log(name)
//     cb(null, name)
//   }
// });
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

exports.uploadUserPhoto = upload.single('photo');

exports.resizeUserPhoto = async(req, res, next) => {
  if (!req.file) return next();
    req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;
     await sharp(req.file.buffer)
      .resize(500, 500)
      .toFormat('jpeg')
      .jpeg({ quality: 90 })
      .toFile(`public/img/users/${req.file.filename}`);
       next();
};
const users = JSON.parse(
  fs.readFileSync(path.join(__dirname + '/../dev-data/data/users.json')),
);
const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });
  res.status(200).json({
    status: 'sucess',
    data: null,
  });
});
exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

exports.updateMe = catchAsync(async (req, res, next) => {
  // create error if user posts passwords data
  if (req.body.password || req.body.confirmPassword) {
    return next(
      new AppError('this field is not for changing password data', 400),
    );
  }
  //update the user document
  console.log(req.file);
  const filterbody = filterObj(req.body, 'name', 'email');
  if(req.file) filterbody.photo = req.file.filename;
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filterbody, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    status: 'sucess',
    data: {
      user: updatedUser,
    },
  });
  // next();
});
exports.getAllusers = handleFactory.getAll(User);
exports.getUser = handleFactory.getOne(User);
exports.deleteUser = handleFactory.deleteOne(User);
exports.updateUser = handleFactory.updateOne(User);
// exports.createNewuser = handleFactory.createOne(User);
