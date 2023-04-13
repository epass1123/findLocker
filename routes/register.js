import express from 'express';
import User from '../models/users.js';
const router = express.Router();

router.post(
    "/",
    async (req, res) => {
      // req의 body 정보를 사용하려면 server.js에서 따로 설정을 해줘야함
      const { name, id ,email, password } = req.body;
  
      try {
        // email을 비교하여 user가 이미 존재하는지 확인
        let user = await User.findOne({ email });
              if (user) {
          return res
            .status(400)
            .json({ errors: [{ msg: "User already exists" }] });
        }
              
        // user에 name, email, password 값 할당
        user = new User({
          name,
          id,
          email,
          password,
        });
  
        // // password를 암호화 하기
        // const salt = await bcrypt.genSalt(10);
        // user.password = await bcrypt.hash(password, salt);
  
        await user.save(); // db에 user 저장
  
        res.send("Success");
      } catch (error) {
        console.error(error.message);
        res.status(500).send("Server Error");
      }
    }
  );
  
  export default router; // export