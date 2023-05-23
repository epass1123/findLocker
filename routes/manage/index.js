import express from "express";
import alertMove from "../../js/util/alertMove.js";
import User from '../../models/users.js';
import Locker from '../../models/lockers.js';
const router = express.Router();

router.get('/',
    async (req,res)=>{
        if(!req.session.user){
            return res.
                send(alertMove("/routes/login","로그인이 필요합니다."));
        }
        else{
            if(req.session.user.authority === '관리자'){
                let users = await User.find({});
                let lockers = await Locker.find({});
                res.render(
                    "manage/index",
                    {
                        user: req.session.user,
                        users,
                        lockers
                    }
                )    
            }
        }
    }
)

router.post('/',
async (req,res)=>{ 
    if(req.session.user.authority === '관리자'){
        let { user } = req.body;
        console.log(user)
        if(user){
            if(typeof user === "string"){
                await User.findByIdAndDelete(user);
            }
            else{
                for(let i = 0; i<user.length;i++){
                    await User.findByIdAndDelete(user[i]);
                }
            }
                return res.
                    send(alertMove("./manage","회원삭제가 완료되었습니다."))            

        }
    }
}
)


export default router;