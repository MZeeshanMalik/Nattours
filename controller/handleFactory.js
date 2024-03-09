const catchAsync = require('../utils/catchAsync')
const AppError = require('../utils/appError')
const ApiFeatures = require('../utils/ApiFeatures')

exports.deleteOne = Model=> catchAsync(async (req, res,next) => {
    const document =  await Model.findByIdAndDelete(req.params.id);
     if(!document){
       return next(new AppError(`document with this id not found` , 404))
      }
     res.status(204).json({
       status: 'sucess',
       message: 'deleted',
     });
   });

exports.updateOne = Model=> catchAsync(async (req, res,next) => {
    const document = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators : true, 
    });
    if(!document){
      return next(new AppError('document with this id not found' , 404))
     }
    res.status(200).json({
      status: 'sucess',
      data: document,
    });
  });
  exports.createOne = Model =>  catchAsync(async (req, res,next) => {
    const document = await Model.create(req.body);
    if(!document){
      return next(new AppError('document could not be created' , 404))
     }
    res.status(200).json({
      status: 'suceess',
      data: document,
    });
  });
  
  exports.getOne = (Model , popOptioins)=> 
  catchAsync(async (req, res,next) => {
    let query =   Model.findById(req.params.id);
    if(popOptioins) query = Model.findById(req.params.id).populate(popOptioins)
    document = await query;
  
    if(!document){
     return next(new AppError('tour with this id not found' , 404))
    }
      res.status(200).json({
        status: 'sucess',
        data: document,
      });
  });
  exports.getAll = Model=> catchAsync(async (req, res,next) => {
    // To allow nested get reviews on tour
    let filter = {};

        if(req.params.tourid) filter = {tour: req.params.tourid};
    const features = new ApiFeatures(Model.find(filter), req.query)
    .filter()
    .sort()
    .pagination()
    .limitFields();
  const document = await features.query;
// explain can be used to check how many documents were serched to find query 
  // const document = await features.query.explain();
  res.status(200).json({
    status: 'sucess',
    results: document.length,
    data: document,
  });
  });