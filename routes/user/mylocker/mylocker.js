import express from "express";
import alertMove from "/Users/kim/Desktop/web/memosite/js/util/alertMove.js";
import User from '../../../models/users.js';
import Locker from '../../../models/lockers.js';
const router = express.Router();

router.get('/',
    async (req,res)=>{
        if(!req.session.user){
            return res.
                send(alertMove("/routes/login","로그인이 필요합니다."))
        }
        else{
            let myname = req.session.user.name
            let mylocker = await Locker.find({userName: myname});
            res.render(
                "user/mylocker/mylocker",
                {   
                    mylocker,
                    user: req.session.user,
                }
            )    
        }
    }
)

router.post('/',
    async (req,res)=>{ 
        if(req.session.user){
            let { locker } = req.body;
            if(locker){
                if(typeof locker === "string"){
                    await Locker.deleteOne({stationName: locker});
                    return res.
                        send(alertMove("./mylocker","삭제가 완료되었습니다."))
                } 
                else{
                    for(let i = 0;i<locker.length;i++){
                        await Locker.deleteOne({stationName: locker[i]});
                    }
                    return res.
                        send(alertMove("./mylocker","삭제가 완료되었습니다."))
                }
            }
            console.log(locker)
        }

    }
)

export default router;