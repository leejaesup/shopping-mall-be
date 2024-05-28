const express =require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
// const indexRouter = require('./routes/index');
require('dotenv').config();

const app = express();
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use(cors());
// app.use("/api", indexRouter);

const mongoURI = process.env.LOCAL_DB_ADDRESS;
mongoose.connect(mongoURI, {useNewUrlParser:true})
    .then(() => {
        console.log("mongoose connected");
    })
    .catch((error) => {
        console.log("DB connection fail", error);
    });

const port = 5005;
app.listen(process.env.PORT || port, () => {
    console.log("server on ", port);
})
