const modelReserve = require('../model/reserve.model')
const modelConfig = require('../model/config.model')
const modelGroup = require('../model/group.mode')
const modelShopeclose = require('../model/shopeclose.model')



const moment = require('moment')
const { ChangeNumberToCode } = require('../helpers/util')
const line = require("@line/bot-sdk");

let line1 = new line.Client({
    channelAccessToken: process.env.lineTokenUser,
    channelSecret: process.env.lineSecretUser,
});



const add = async (req, res) => {
    const modelReserveSession = await modelReserve.startSession();
    try {
        await modelReserveSession.startTransaction();
        const Data = req.body
        console.log('Data', Data);

        let user = await modelGroup.findOne({ lineId: Data.Profile.userId })
        if (!user) {
            const newGroup = new modelGroup({
                lineId: Data.Profile.userId,
                name: Data.Profile.displayName
            }); // Edit Information of First Admin Account Here!!!
            user = await newGroup.save();

        }
        const reserve = await modelReserve.findOne({
            date: {
                $gte: moment(Data.date).utc().startOf('day').format(),
                $lt: moment(Data.date).utc().endOf('day').format()
            }
        })

        const configGroup = await modelConfig.findOne({ name: 'groupCustomer' })
        const configopentServiceTime = await modelConfig.findOne({ name: 'opentServiceTime' })
        // const checkUser = await modelReserve.countDocuments({ 'slotTime.status': 'A', 'slotTime.group.groupId': user._id })
        // if (checkUser > 0) {
        //     throw { message: 'ลูกค้าไม่สามารถจองคิวซ้ำได้ โปรดติดต่อแอดมิน' }
        // }

        if (parseFloat(moment(Data.date).utc().format('HH')) < parseFloat(configopentServiceTime.valueObject.timeStart) || parseFloat(moment(Data.date).utc().format('HH')) > parseFloat(configopentServiceTime.valueObject.timeEnd)) {
            throw { message: 'ช่วงเวลาดังกล่าวยังไม่เปิดให้บริการ' }
        }

        if (reserve) {
            const slotTime = reserve.slotTime.find(x => x.time === moment(Data.date).utc().format('HH'))
            if (slotTime) {
                if (parseFloat(configGroup.value) > slotTime.group.length) {
                    await modelReserve.findOneAndUpdate({ _id: reserve._id, 'slotTime.time': moment(Data.date).utc().format('HH') },
                        {
                            $push: {
                                'slotTime.$.group': { groupId: user._id }
                            }
                        })
                } else {
                    throw { message: 'คิวเต็มโปรดทำการเลือกช่วงเวลาถัดไป' }
                }
            } else {
                await modelReserve.findByIdAndUpdate(reserve._id, {
                    $push: {
                        slotTime: {
                            time: moment(Data.date).utc().format('HH'),
                            group: [{ groupId: user._id }]
                        }
                    }
                })
            }
        } else {
            const newReserve = new modelReserve({
                date: moment(Data.date).utc().format(),
                slotTime: [
                    {
                        time: moment(Data.date).utc().format('HH'),
                        group: [{ groupId: user._id }]
                    }
                ],
            }); // Edit Information of First Admin Account Here!!!
            await newReserve.save();
        }
        await line1.pushMessage(user.lineId, {
            type: "flex",
            altText: `จองคิว !!!`,
            contents: {
                "type": "bubble",
                "header": {
                    "type": "box",
                    "layout": "vertical",
                    "contents": [
                        {
                            "type": "text",
                            "weight": "bold",
                            "size": "lg",
                            "text": "จองคิว White&Space"
                        }
                    ],
                    "backgroundColor": "#C6CCC6"
                },
                "body": {
                    "type": "box",
                    "layout": "vertical",
                    "contents": [
                        {
                            "type": "box",
                            "layout": "vertical",
                            "margin": "none",
                            "spacing": "sm",
                            "contents": [
                                {
                                    "type": "box",
                                    "layout": "baseline",
                                    "spacing": "sm",
                                    "contents": [
                                        {
                                            "type": "text",
                                            "text": "วันที่",
                                            "color": "#aaaaaa",
                                            "size": "sm",
                                            "flex": 1,
                                            "weight": "bold"
                                        },
                                        {
                                            "type": "text",
                                            "text": moment(Data.date).format('YYYY-MM-DD'),
                                            "wrap": true,
                                            "color": "#666666",
                                            "size": "sm",
                                            "flex": 5,
                                            "weight": "bold"
                                        }
                                    ]
                                },
                                {
                                    "type": "box",
                                    "layout": "baseline",
                                    "spacing": "sm",
                                    "contents": [
                                        {
                                            "type": "text",
                                            "text": "เวลา",
                                            "color": "#aaaaaa",
                                            "size": "sm",
                                            "flex": 1,
                                            "weight": "bold"
                                        },
                                        {
                                            "type": "text",
                                            "text": `${moment(Data.date).format('HH:mm')} - ${moment(Data.date).add(1, 'hours').format('HH:mm')}`,
                                            "wrap": true,
                                            "color": "#666666",
                                            "size": "sm",
                                            "flex": 5,
                                            "weight": "bold"
                                        }
                                    ]
                                },
                                {
                                    "type": "box",
                                    "layout": "baseline",
                                    "spacing": "sm",
                                    "contents": [
                                        {
                                            "type": "text",
                                            "text": "คุณ",
                                            "color": "#aaaaaa",
                                            "size": "sm",
                                            "flex": 1,
                                            "weight": "bold"
                                        },
                                        {
                                            "type": "text",
                                            "text": user.name,
                                            "wrap": true,
                                            "color": "#666666",
                                            "size": "sm",
                                            "flex": 5,
                                            "weight": "bold"
                                        }
                                    ]
                                },
                                {
                                    "type": "box",
                                    "layout": "baseline",
                                    "spacing": "sm",
                                    "contents": [
                                        {
                                            "type": "text",
                                            "text": "จองคิวแล้ว ✅",
                                            "wrap": true,
                                            "color": "#666666",
                                            "size": "sm",
                                            "flex": 5,
                                            "weight": "bold"
                                        }
                                    ],
                                    "paddingTop": "15px"
                                }
                            ]
                        }
                    ]
                }
            },
        });
        await modelReserveSession.commitTransaction();

        res.json({ message: 'บันทึกสำเร็จ' })

    } catch (err) {
        console.log(err);
        res.status(500).json({ message: !err.message ? 'เกิดข้อผิดพลาด' : err.message })

    } finally {
        await modelReserveSession.endSession();
    }
}

const getCalendarForMouth = async (req, res) => {
    try {
        const Data = req.query
        const closeShop = await modelShopeclose.find({
            date: {
                $gte: moment(`${Data.dateYear}-${Data.dateMonth}`).startOf('month').utc().format(),
                $lte: moment(`${Data.dateYear}-${Data.dateMonth}`).endOf('month').utc().format()
            }
        })
        const opentServiceTime = await modelConfig.findOne({ name: "opentServiceTime" })

        res.json({ closeShop, timeService: opentServiceTime.valueObject })
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'เกิดข้อผิดพลาด' })
    }
}

const getDateReserve = async (req, res) => {
    try {
        const Data = req.query
        const reserve = await modelReserve.findOne({
            date: {
                $gte: moment(moment(Data.date).startOf('day')).utc().format(),
                $lt: moment(moment(Data.date).endOf('day')).utc().format()
            }
        })
        const opentServiceTime = await modelConfig.findOne({ name: "opentServiceTime" })
        const Group = await modelConfig.findOne({ name: 'groupCustomer' })

        res.json({ reserve, timeService: opentServiceTime.valueObject, limitGroup: Group.value })
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'เกิดข้อผิดพลาด' })
    }
}

module.exports = {
    add,
    getCalendarForMouth,
    getDateReserve
}