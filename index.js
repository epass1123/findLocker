import ejs from 'ejs'
import express from 'express'
import bodyParser from 'body-parser'
import dotenv from 'dotenv'
import path from 'path'
import Locker from './models/lockers.js'

import expressSession from "express-session"
import MemoryStore from "memorystore"
const memorystore = MemoryStore(expressSession);

import lockerRouter from "./routes/locker.js"
import registerRouter from "./routes/register.js"
import loginRouter from "./routes/login.js"
import addRouter from "./routes/add.js";
import logoutRouter from "./routes/logout.js";
import mypageRouter from "./routes/mypage.js";

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

const maxAge = 1000 * 60 * 5;

app.use(expressSession({
    cookie: {
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
app.use("/routes/locker", lockerRouter);
app.use("/routes/register", registerRouter);
app.use("/routes/login", loginRouter);
app.use("/routes/add", addRouter);
app.use("/routes/logout", logoutRouter);
app.use("/routes/mypage", mypageRouter);

app.get('/',async function(req,res){
    let list = await Locker.find({});
    if(req.session.user){
        const auth = req.session.user.authority 
        if(auth === "관리자"){
            res.render('index',{
                user: req.session.user,
                appkey: process.env.APPKEY,
                list: list,
                manager: true,
            })
        }
        else{res.render('index',{
            user: req.session.user,
            appkey: process.env.APPKEY,
            list: list,
            manager: false,
        })
        }
    }
    else{
        res.render('index',{
            user: null,
            appkey: process.env.APPKEY,
            list: list
    })
}
});

app.listen(process.env.PORT, ()=>console.log("서버 open"))