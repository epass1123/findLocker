import express from 'express';
import Locker from '../models/lockers.js'
import alertMove from '../js/util/alertMove.js';
import { getCoord } from '../js/coord.js';
const router = express.Router();

router.get("/",
    async (req, res) => {
      if(!req.session.user){
        return res
          .send(alertMove("/","로그인이 필요합니다."))
      }
      else{
        res.render("add",
        {
            name:req.session.user.name,
        }
    )}
});

router.post('/', 
async (req,res)=>{
    const locker = new Locker(req.body);
    const { lockerName, userName, password, address, location, price, imageFile, numberOf } = req.body;
    try{

        let lockerAddress = await Locker.findOne({address});
        let lockername = await Locker.findOne({stationName: lockerName});

        if (lockerAddress) {
            return res
              .status(400)
              .send(alertMove("/routes/add",'이미 존재하는 보관함입니다.'))
          }
        else if(lockername){
            return res
            .status(400)
            .send(alertMove("/routes/add","중복된 보관함이름 입니다."))
        }
        let lastId = await Locker.findOne({},{id:1, _id:0}).sort({id:-1}).limit(1);
          
        await getCoord(lockerName).then(x=>{
            let locker = new Locker({ 
                id: lastId.id+1,
                stationName: lockerName,
                userName, 
                password, 
                address, 
                location, 
                price, 
                numberOf,
                longitude:x.longitude,
                latitude:x.latitude,
            });

            locker.save();
            return res  
                .send(alertMove("/","등록 성공"));
    
        });
          // user에 name, email, password 값 할당
        
    
    }
    catch(e){
        console.log(e)
        return res
            .send(alertMove("/routes/add","등록 실패"));
    }
})

export default router; // export
