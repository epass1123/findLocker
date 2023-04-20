import express from 'express';
import Locker from '../models/lockers.js'
import api from "../js/api_csv.js"
const {getCoord} = await import("../js/coord.js")
const router = express.Router();

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

router.get("/", async (req, res) => {
    try {
      const locker = await Locker.find({});
      res.status(200).send(locker);
      console.log("get")
    } catch (e) {
        console.log(e);
      res.status(500).json({
        message: "조회 실패",
      });
    }
});

router.post('/', async (req,res)=>{
try{
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
    res.status(204).send();
    console.log("post")
}
catch(e){
    console.log(e)
    res.status(500).json({
        message: "저장 실패"
    })
}
})

export default router; // export