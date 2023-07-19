const mongoose = require("mongoose");
const { Schema } = mongoose;
const { ChangeNumberToCode } = require('../helpers/util')
const mongoosePaginate = require("mongoose-paginate-v2");



const reserve = new Schema({
    serial: {
        type: String,
    },
    date: {
        type: Date,
        required: ["กรุณากรอกข้อมูลเวลาให้ครบถ้วน"],
    },
    slotTime: [
        {
            time: {
                type: String,
            },
            group: [
                {
                    groupId: {
                        type: mongoose.Schema.Types.ObjectId,
                        ref: "groups",
                        default: null,
                    },
                    status: {
                        type: String,
                        default: 'A', // A action C cencel // S Admin
                    },
                }
            ]
        }
    ],
}, { timestamps: { createdAt: 'created_at' } });

reserve.pre("save", async function (next) {
    try {
        const run = await reserves.countDocuments({})
        this.serial = `R-${await ChangeNumberToCode(run)}`
        next();
    } catch (error) {
        next(error);
    }
});
reserve.plugin(mongoosePaginate);



var reserves = mongoose.model("reserves", reserve);
module.exports = reserves;
