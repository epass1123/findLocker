import express from 'express';
import User from '../models/users.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import expressSession from "express-session"
const router = express.Router();

router.get(
  "/",
    async(req, res)=>{
      res.render("login",{})
    }
)

router.post(
    "/",
    async (req, res) => {
      // req의 body 정보를 사용하려면 server.js에서 따로 설정을 해줘야함
      const { name, id ,email, password } = req.body;
    
      try {
        // email을 비교하여 user가 이미 존재하는지 확인
          let user = await User.findOne({ id });
            if (!user) {
                return res
                .status(400)
                .send(`
                <script>
                  alert('등록되지 않은 회원입니다.')
                  location.href = '/login'
                </script>`);
                }
          const check = await bcrypt.compare(password, user.password);
          if(check){
              const token = jwt.sign({userId: user._id}, 'secretToken');
              return res.redirect("/")
              
          }else{
            return res
              .status(400)
              .send(`
              <script>
                alert('등록되지 않은 회원입니다.')
                location.href = '/login'
              </script>`)
          }
               
          }catch(err){
            console.log(err);
            return res.status(400).send({ err: err.message });
          }
    }
  );
  
  export default router; // export
