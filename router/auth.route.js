const express = require('express')
const AuthController = require('../controller/admin.cotroller')
const {myPassport} = require("../util/passport");

const router = express();
router.post('/sign-in', AuthController.signIn)
router.post('/refresh/token', AuthController.refreshToken)
router.post('/',myPassport, AuthController.addAdmin)
router.post('/newpass',myPassport, AuthController.newPass)






module.exports = router;
