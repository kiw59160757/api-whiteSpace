const express = require('express')
const router = express();
const modelConfig = require('../model/config.model');
const modelShopeclose = require('../model/shopeclose.model');

const moment = require('moment')




async function initial() {
    try {
        const countGroupCustomer = await modelConfig.countDocuments({ name: "groupCustomer" });
        if (countGroupCustomer === 0) {
            const GroupCustomer = new modelConfig({
                name: "groupCustomer",
                value: "3",
                detail: "จำนวนโต๊ะให้บริการ",
            });
            await GroupCustomer.save();
        }


        const countopentServiceTime = await modelConfig.countDocuments({ name: "opentServiceTime" });
        if (countopentServiceTime === 0) {
            const opentServiceTime = new modelConfig({
                name: "opentServiceTime",
                valueObject: {
                    timeStart: '03',
                    timeEnd: '13'
                },
                detail: "เวลาให้บริการ",
            });
            await opentServiceTime.save();
        }
    } catch (error) {
        console.log(error);
    }
}

initial()

router.get('/', async (req, res) => {
    try {
        const items = await modelConfig.find()
        res.json(items)
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'เกิดข้อผิดพลาด' })
    }
})


router.post('/shope/close', async (req, res) => {
    try {
        const Data = req.body
        const date = moment(Data.date).startOf('day').format()
        if (Data.status) {
            const check = await modelShopeclose.countDocuments({ date: moment(date).utc().format() })
            if (check === 0) {
                const model = new modelShopeclose({
                    date: moment(date).utc().format()
                });
                await model.save();
            }
        } else {
            await modelShopeclose.deleteOne({ date: moment(date).utc().format() })
        }
        res.json({ message: 'บันทึกสำเร็จ' })
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'เกิดข้อผิดพลาด' })
    }
})







module.exports = router