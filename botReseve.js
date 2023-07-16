const moment = require("moment");


const modelReserve = require('./model/reserve.model')



const botReseve = async () => {
    await modelReserve.updateMany({
        date: {
            $lt: moment().utc()
        },
        'slotTime.status': 'A',
        'slotTime.time': moment().utc().format('MM')
    })

};





module.exports = {
    botReseve,

}