const modelReserve = require('../model/reserve.model')
const moment = require('moment')


const reportSumQueue = async (req, res) => {
    try {
        const ReserveQue = await modelReserve.find({
            'slotTime.group.status': 'A',
            date: {
                $gte: moment().utc().startOf('day').format(),
            }
        })
        let totalQueue = 0
        let totalQueueToday = 0

        await Promise.all(ReserveQue.map(async x => {
            await Promise.all(x.slotTime.map(async r => {
                const que = r.group.filter(m => m.status === 'A').length
                totalQueue += que
                if (moment().utc().startOf('day').format() === moment(x.date).utc().startOf('day').format()){
                    totalQueueToday += que
                }
                return true
            }
            ))
            return true
        }))

        res.json({totalQueueToday,totalQueue})
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'เกิดข้อผิดพลาด' })
    }
}






module.exports = {
    reportSumQueue,
}