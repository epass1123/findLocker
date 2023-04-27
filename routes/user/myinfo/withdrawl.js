import express from "express";
import alertMove from "/Users/kim/Desktop/web/memosite/js/util/alertMove.js";
import User from '../../../models/users.js';
const router = express.Router();

router.get('/',
    async (req,res)=>{
        if(!req.session.user){
            return res.
                send(alertMove("/routes/login","로그인이 필요합니다."))
        }
        else{
            res.render(
                "user/myinfo/withdrawl",
                {
                    user: req.session.user,
                }
            )    
        }
    }
)

router.post('/',
    async (req,res)=>{ 
        if(req.session.user){
            let _id = req.session.user._id;
            await User.findByIdAndDelete(_id);
            req.session.user = undefined;
            return res
                .send(alertMove("/","회원탈퇴가 완료되었습니다."))
        }

    }
)

export default router;