import express from 'express';
import Locker from '../models/lockers.js';
import alertMove from '../js/util/alertMove.js';
import bcrypt from 'bcrypt';
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
            id:req.session.user.id,
        }
    )}
});

router.post('/', 
async (req,res)=>{
    const locker = new Locker(req.body);
    const { lockerName, userId, password, address, location, price, imageFile, numberOf } = req.body;
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
        else{
            let lastId = await Locker.findOne({},{id:1, _id:0}).sort({id:-1}).limit(1);
            
            const salt = await bcrypt.genSalt(10);
            let userPassword = await bcrypt.hash(password, salt);
    
    
            //내가 원하지 않는 동명의 다른 주소의 위치가 저장될 수 있음 => 선택지를 주고 선택
    
            await getCoord(lockerName).then(x=>{
                let arr = x;
                let msg;
                let locker
                    for(let i = 0; i<arr.length ; i++){
                        if(arr[i].address_name === address || arr[i].road_address_name === address){
                            msg = "등록 성공"
                            locker = new Locker({ 
                                        id: lastId.id+1,
                                        stationName: lockerName,
                                        userName, 
                                        password: userPassword, 
                                        address, 
                                        location, 
                                        price, 
                                        numberOf,
                                        longitude: arr[i].x,
                                        latitude: arr[i].y,
                                    });
                            
                            locker.save();
                            break;
                        }
                        else{
                            msg = "주소를 다시 확인해주세요."
                        }
                    }
                    if(locker){
                        return res.send(alertMove("/",msg));
                    }else{
                        return res.send(alertMove("./",msg));
                    }
            });
        }

    }
    catch(e){
        console.log(e);
        return res
            .send(alertMove("/routes/add","등록 실패"));
    }
})

export default router; // export
