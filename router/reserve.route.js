const express = require('express')
const router = express();

const reserveController = require('../controller/reserve.controller');


router.post('/', reserveController.add)
router.get('/CalendarForMouth', reserveController.getCalendarForMouth)
router.get('/', reserveController.getDateReserve)



module.exports = router