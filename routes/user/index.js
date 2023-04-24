import express from "express";
import User from "../../models/users.js";
const router = express.Router();

router.get('/',
    async (req,res)=>{
        if(req.session){
            res.render(
                "login"
            )
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