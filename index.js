import ejs from 'ejs'
import express from 'express'
import bodyParser from 'body-parser'
import dotenv from 'dotenv'
import path from 'path'

import expressSession from "express-session"
import MemoryStore from "memorystore"
const memorystore = MemoryStore(expressSession);

import indexRouter from "./routes/index.js"
import lockerRouter from "./routes/locker.js"
import registerRouter from "./routes/register.js"
import loginRouter from "./routes/login.js"
import addRouter from "./routes/add.js";
import logoutRouter from "./routes/logout.js";
import mypageRouter from "./routes/user/index.js";
import modifyRouter from "./routes/user/myinfo/modify.js";
import withdrawlRouter from "./routes/user/myinfo/withdrawl.js";
import favRouter from "./routes/user/mylocker/favorites.js";
import mylockerRouter from "./routes/user/mylocker/mylocker.js";
import managerRouter from "./routes/manage/index.js"

const app = express();
const __dirname = path.resolve();
dotenv.config();

app.set('views','./views');
app.set("view engine","ejs");
app.engine('html', ejs.renderFile);

app.use(express.static(__dirname));
app.use(express.json({ extended: false }));
//__dirname 하위의 폴더들을 사용

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

const maxAge = 1000 * 60 * 20;

app.use(expressSession({
    cookie: {
        path: '/',
        maxAge,
      },
    store: new memorystore({ checkPeriod: maxAge }),
    resave: false,
    secret: 'kong',
    saveUninitialized: true,
}));

import mongoose from 'mongoose';
mongoose.set('strictQuery', true)
mongoose.connect(
    `mongodb+srv://Kim:${process.env.DB_PASSWORD}@cluster0.zwmf9jb.mongodb.net/?w=majority`,{
        useNewUrlParser: true,
        useUnifiedTopology: true,
        // useCreateIndex: true,
        // useFindAndModify: false,
    }, 6000000)
    .then(() => console.log('MongoDB conected'))
    .catch((err) => {
        console.log(err);
});

//미들웨어
app.use("/", indexRouter);
app.use("/routes/locker", lockerRouter);
app.use("/routes/register", registerRouter);
app.use("/routes/login", loginRouter);
app.use("/routes/add", addRouter);
app.use("/routes/logout", logoutRouter);
app.use("/routes/user/index", mypageRouter);
app.use("/routes/user/myinfo/modify", modifyRouter);
app.use("/routes/user/myinfo/withdrawl", withdrawlRouter);
app.use("/routes/user/mylocker/favorites", favRouter);
app.use("/routes/user/mylocker/mylocker", mylockerRouter);
app.use("/routes/manage", managerRouter);

app.listen(process.env.PORT, ()=>console.log("서버 open"))