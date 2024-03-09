const contentDisposition = require('content-disposition');
const AppError = require('./../utils/appError');

const handleCastErrorDB = (err) => {
  const message = `invalid ${err.path} : ${err.value}`;
  return new AppError(message, 400);
};

const  handleDuplicateFieldDb = (err)=>{
  const val = Object.values(err.keyValue)[0];
  // console.log(val)
const message = `Duplicate value in field: ${val}`
return new AppError(message , 400)
}

const handleValidationErrorDB = err =>{
  const errors = Object.values(err.errors).map(el=> el.message)
  const message = errors.join("/n/");
  return new AppError(message, 400)
} 

const handlejwtError = err=>{
   const message = 'json web token is not correct';
   return new AppError(message , 401)
  }

const sendErrorDev = (err,req, res) => {
  if(req.originalUrl.startsWith('/api')){
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      stack: err.stack,
      error: err,
    });
  }else{
    res.status(err.statusCode).render('error', {
      title: 'something went wrong',
      msg: err.message
    });
  };
};

const sendErrorPro = (err,req, res) => {
  if(req.originalUrl.startsWith('/api')){
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      stack: err.stack,
      error: err,
    });
  // opreational trusted errors send message to clint
  if (err.isOpreational) {
    res.status(err.statusCode).render('error', {
      title: 'something went wrong',
      msg: err.message
    })
  }
  // programming errors not want to leak details of error
  else {
    // console.error(err)
    res.status(err.statusCode).render('error', {
      title: 'something went wrong',
      msg: 'please try again later'
    })
  }
}};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';
  if (process.env.Node_ENV === 'devolpment') {
    sendErrorDev(err,req, res);
  } else if (process.env.Node_ENV === 'production') {
    let error = { ...err };
    console.log(error.name)
    error.message = err.message;
    if (err.name === 'CastError') error = handleCastErrorDB(error);
    if (err.code === 11000) error = handleDuplicateFieldDb(error);
    if(err.name === 'ValidationError') error= handleValidationErrorDB(error)
    if(err.name === 'JsonWebTokenError') error = handlejwtError(error)

    sendErrorPro(error,req, res);
  }
};
