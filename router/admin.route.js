const express = require('express')
const AdminController = require('../controller/admin.controller')
const {myPassport} = require("../util/passport");

const router = express();
router.get('/sum-que', AdminController.reportSumQueue)






module.exports = router;
