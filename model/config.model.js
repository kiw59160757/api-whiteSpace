const mongoose = require("mongoose");
const { Schema } = mongoose;

const ConfigSchema = new Schema({
    name: {
        type: String,
        default: '',
        unique: true,
    },
    value: {
        type: String,
        default: '',
    },
    valueArray:{
        type:[],
        default:[]
    },
    valueObject: {
        type: {},
        default: null,
    },
    detail: {
        type: String,
        default: '',
    },
})

var Config = mongoose.model('Config', ConfigSchema)

module.exports = Config;