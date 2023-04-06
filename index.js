import ejs from 'ejs'
import express from 'express'
import bodyParser from 'body-parser'
import Locker from './models/lockers.js'
import api from "./models/api_csv.js"
const {getCoord} = await import("./js/coord.js")
import dotenv from 'dotenv'
import path from 'path'
import fs from 'fs'

const app = express();
const __dirname = path.resolve();
dotenv.config();

app.set('views','./views');
app.set("view engine","ejs");
app.engine('html', ejs.renderFile);

app.use(express.static(__dirname))
//__dirname 하위의 폴더들을 사용

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

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


//보관함들 리스트에 좌표정보 추가
const array = async function(arr){
        for(let i = 0;i<api.length;i++){
            await getCoord(api[i].stationName + api[i].line).then(x=>{
                x.floor = api[i].floor
                x.line = api[i].line
                x.size = api[i].size
                x.location = api[i].location
                x.price = api[i].price
                x.numberOf = api[i].numberOf
                x.id = i
                arr.push(x)
                })
        }
    return arr
}

let list = []

await array(list).then(x=>
    Locker.insertMany(x,{ordered:false}).then(function(){
    console.log("success")
    }).catch(function(err){
    if(err.code===11000){
        console.log("id가 중복된 도큐먼트가 있습니다.")
    }
    else{
        console.log(err)
    }
})
)

app.get('/',function(req,res){
    res.render('index',{
        appkey:process.env.APPKEY,
        api:api,
        list:list
    })
});


app.post('/locker', async (req,res)=>{
    const locker = new Locker(req.body);
    try{
        await locker.save();
        res.status(204).send();
    }
    catch(e){
        res.status(500).json({
            message: "저장 실패"
        })
    }
})
    
app.get("/locker", async (req, res) => {
    try {
      const locker = await Locker.find({});
      res.status(200).send(locker);
    } catch (e) {
      res.status(500).json({
        message: "User 조회 실패",
      });
    }
});

  
app.listen(process.env.PORT, ()=>console.log("서버 open"))