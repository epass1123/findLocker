import express from "express";
import alertMove from "../../js/util/alertMove.js";
import User from '../../models/users.js';
import bcrypt from 'bcrypt'
const router = express.Router();

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


router.get('/myinfo/modify',
    async (req,res)=>{
        if(!req.session.user){
            return res.
                send(alertMove("/routes/login","로그인이 필요합니다."))
        }
        else{
            res.render(
                "user/myinfo/modify",
                {
                    user: req.session.user,
                }
            )    
        }
    }
)

router.post('/myinfo/modify',
    async (req,res)=>{ 
        let _id = req.session.user._id
        const { name, id ,email, password, passwordChk } = req.body;
        try{
            if(req.session.user){
                if(password === passwordChk){
                    console.log("같음")
                    const salt = await bcrypt.genSalt(10);
                    let encryptPassword = await bcrypt.hash(password, salt);
                    await User.updateMany({_id:_id},
                        {
                            $set:{
                                name:name,
                                id:id,
                                email:email,
                                password:encryptPassword
                            }
                        }
                    )
                    let user = await User.findOne({ _id });
                    req.session.user = user;
                    return res.
                        send(alertMove("../index","회원정보 수정 완료"))
                    }
                else{
                    return res.send(alertMove("./modify","비밀번호가 일치하지 않습니다."))
                }
                    
            }
            else{
                console.log("해당하는 유저 없음")
            }
        }
        catch(e){
            console.log(e)
        }
    }
)

export default router;