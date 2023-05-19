import express from "express";
import alertMove from "../../js/util/alertMove.js";
import User from '../../models/users.js';
import Locker from '../../models/lockers.js';
import bcrypt from 'bcrypt'
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
        const { password } = req.body;
        try{
            if(req.session.user){
                let id = req.session.user.id
                let user = await User.findOne({ id });
                const check = await bcrypt.compare(password, user.password);
              if(check){
                return res.redirect("../user/myinfo/modify")
              }
              else{
                return res.
                send(alertMove("../user/index", "비밀번호가 다릅니다."))
              }
            }
            else{
                return res.
                send(alertMove("/routes/login","로그인이 필요합니다."))
            }
        }
        catch(e){
            console.log(e)
        }

    }
)

export default router;