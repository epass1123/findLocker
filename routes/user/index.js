import express from "express";
import alertMove from "../../js/util/alertMove.js";
import User from '../../models/users.js';
import bcrypt from 'bcrypt'
const router = express.Router();
import * as myinfo from "./myinfo/myinfo.controller.js"
import * as mylocker from "./mylocker/mylocker.controller.js"

router.get('/index',
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

router.post('/index',
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

router.get('/myinfo/modify',myinfo.modifyGet);
router.post('/myinfo/modify',myinfo.modifyPost);

router.get('/myinfo/withdrawl',myinfo.withdrawlGet);
router.post('/myinfo/withdrawl',myinfo.withdrawlPost);

router.get('/mylocker/mylocker',mylocker.mylockerGet);
router.post('/mylocker/mylocker',mylocker.mylockerPost);

router.get('/mylocker/favorites',mylocker.favoritesGet);
router.post('/mylocker/favorites',mylocker.favoritesPost);

export default router;