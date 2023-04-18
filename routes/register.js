import express from 'express';
import User from '../models/users.js';
import bcrypt from 'bcrypt'
import alertMove from '../js/alertMove.js';
const router = express.Router();

router.get("/",
    async(req,res)=>{
        res.render("register",{

        })
    }    
)

router.post(
    "/",
    async (req, res) => {
      // req의 body 정보를 사용하려면 server.js에서 따로 설정을 해줘야함
      const { name, id ,email, password, passwordChk } = req.body;
    
      try {
        // email을 비교하여 user가 이미 존재하는지 확인
        let user = await User.findOne({ id });
        if (user) {
          return res
            .status(400)
            .send(alertMove("/routes/register",'이미 존재하는 회원아이디입니다.'))
        }

        else if(password !== passwordChk){
            return res
            .status(400)
            .send(alertMove("/routes/login","비밀번호 확인값이 비밀번호와 다릅니다."))
        }
        
        // user에 name, email, password 값 할당
        user = new User({
          name,
          id,
          email,
          password,
        });
  
        // password를 암호화 하기
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
  
        await user.save(); // db에 user 저장
  
        return res
        .send(alertMove("/","가입성공"))

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Server Error");
      }
    }
  );
  
  export default router; // export