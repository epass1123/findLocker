import express from 'express';
import User from '../models/users.js';
import bcrypt from 'bcrypt';
import alertMove from '../js/util/alertMove.js';
// import jwt from 'jsonwebtoken';
const router = express.Router();

router.get(
  "/",
    async(req, res)=>{
      if(req.session.user){
        return res
          .send(alertMove("/","이미 로그인 되어있습니다."))
      }
      res.render("login",{})
    }
)

router.post(
    "/",
    async (req, res) => {
      // req의 body 정보를 사용하려면 index.js에서 따로 설정을 해줘야함
      const { name, id ,email, password } = req.body;
    
      try {
        // email을 비교하여 user가 이미 존재하는지 확인
          let user = await User.findOne({ id });
            if (!user) {
                return res
                .status(400)
                .send(alertMove("/routes/login","등록되지 않은 회원입니다."));
                }
          const check = await bcrypt.compare(password, user.password);
          if(check){
            // const token = jwt.sign({userId: user._id}, 'secretToken');
            req.session.user = user
            console.log(req.session)
            return res.redirect("/")
            
          }else{
            return res
              .status(400)
              .send(alertMove("/routes/login","등록되지 않은 회원입니다."))
          }
               
          }catch(err){
            console.log(err);
            return res.status(400).send({ err: err.message });
          }
    }
  );
  
  export default router; // export
