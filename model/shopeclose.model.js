const mongoose = require("mongoose");
const { Schema } = mongoose;

const shopeclose = new Schema({
    date: {
        type: Date, // YYYY-MM-DD
        required: ["กรุณากรอกข้อมูลเวลาให้ครบถ้วน"],
    },
}, { timestamps: { createdAt: 'created_at' } });

var shopecloses = mongoose.model("shopecloses", shopeclose);
module.exports = shopecloses;
