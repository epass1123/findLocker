import express from "express";
import User from "../../models/users.js";
import alertMove from "../../js/util/alertMove.js";
const router = express.Router();

router.get('/',
    async (req,res)=>{
        if(!req.session.user){
            return res.
                send(alertMove("/routes/login","로그인이 필요합니다."))
        }
        else{
            res.render(
                "user/index",
                {
                    user: req.session.user,
                }
            )    
        }
    }
)

router.post('/',
    async (req,res)=>{
        
    }
)

export default router;