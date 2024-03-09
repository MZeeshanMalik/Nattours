const express = require('express')
const viewController = require('../controller/viewController')
const authController = require('../controller/authenticationController')
const router = express.Router();
const app = express();
const path = require('path')
app.use(express.static(path.join(__dirname , 'public')))
  router.get('/' , viewController.overview)
  router.get('/tours/:tourname' , viewController.tourdetail);
  router.get('/login', viewController.getLoginForm)
router.get('/me' , viewController.getAccount )
router.post('/submit-user-data' , viewController.updateUserData)
module.exports = router;