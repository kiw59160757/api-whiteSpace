const mongoose = require("mongoose");
const { Schema } = mongoose;
const { ChangeNumberToCode } = require('../helpers/util')

const group = new Schema({
    serial: {
        type: String,
    },
    lineId: {
        type: String,
        required: ["กรุณากรอกข้อมูลserialให้ครบถ้วน"],
    },
    name: {
        type: String,
        default: '',
    },

}, { timestamps: { createdAt: 'created_at' } });


group.pre("save", async function (next) {
    try {
        const run = await groups.countDocuments({})
        this.serial = `C-${await ChangeNumberToCode(run)}`
        next();
    } catch (error) {
        next(error);
    }
});


var groups = mongoose.model("groups", group);




module.exports = groups;
