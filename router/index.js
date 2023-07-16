const express = require('express')

const auth = require('./auth.route');
const reserve = require('./reserve.route');
const config = require('./config.route');

const router = express();
router.use('/auth', auth)
router.use('/config', config)
router.use('/reserve', reserve)

module.exports = router