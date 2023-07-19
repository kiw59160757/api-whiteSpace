const express = require("express");
const app = express();
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const http = require("http");
require("dotenv").config();
const path = require("path");
const moment = require('moment')

const router = require('./router')
const cron = require("node-cron");
const { botReseve } = require('./botReseve')




app.use(morgan("dev"));
app.use(express.json({ limit: "50mb" }))
app.use(express.urlencoded({ limit: "50mb" }))
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());


app.use(router)



mongoose
    .connect(process.env.DB_URL, {
        useNewUrlParser: true,
        // useCreateIndex: true,
        // useUnifiedTopology: true,
        // useFindAndModify: false,
        autoCreate: true,
        autoIndex: true,
    })
    .then((res) => console.log("Connected to DB"))
    .catch((err) => console.log(err));
mongoose.Promise = global.Promise;


app.use("/website", express.static(path.join(__dirname, "html/home.html")));



server = app.listen(3000, async () => {
    console.log(`Server Listening On Port ${3000}`)
    console.log(moment().utc().format());
    // cron.schedule("* * * * *", botReseve);

});
