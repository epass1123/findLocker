import Locker from '../models/lockers.js';
import User from '../models/users.js';
import alertMove from '../js/util/alertMove.js';
import bcrypt from 'bcrypt';
import { getCoord } from '../js/coord.js';
import api from "../js/api_csv.js"

let indexGet = async function(req,res){
    let list = await Locker.find({});
    if(req.session.user){
        res.render('index',{
            user: req.session.user,
            appkey: process.env.APPKEY,
            list: list,
        })
    }
    else{
        res.render('index',{
            user: null,
            appkey: process.env.APPKEY,
            list: list
    })
}
};

let indexPost = async (req,res)=>{
    if(req.session.user){
        let favorites = await User.findOne({id:req.session.user.id}, 'favorites');
        favorites = favorites.favorites;
        const {checkbox, inpValue} = req.body
        if(!checkbox){
            if(favorites.includes(inpValue)){
                favorites.splice(favorites.indexOf(inpValue), 1);
                req.session.user.favorites = favorites
            }
            await User.findOneAndUpdate({id:req.session.user.id},{favorites:favorites});
            
        }
        else{
            if(!favorites.includes(inpValue)){
                favorites.push(inpValue)
                req.session.user.favorites = favorites
                await User.findOneAndUpdate({id:req.session.user.id},{favorites:favorites});
            }
        }
    }
    
};


let addGet = async (req, res) => {
      if(!req.session.user){
        return res
          .send(alertMove("/","로그인이 필요합니다."))
      }
      else{
        res.render("add",
        {
            id:req.session.user.id,
        }
    )}
};

let addPost = async (req,res)=>{
    const locker = new Locker(req.body);
    const { lockerName, userId, password, address, location, price, imageFile, numberOf } = req.body;
    try{

        let lockerAddress = await Locker.findOne({address});
        let lockername = await Locker.findOne({stationName: lockerName});


        if (lockerAddress) {
            return res
              .status(400)
              .send(alertMove("/routes/add",'이미 존재하는 보관함입니다.'))
        }
        else if(lockername){
            return res
            .status(400)
            .send(alertMove("/routes/add","중복된 보관함이름 입니다."))
        }
        else{
            let lastId = await Locker.findOne({},{id:1, _id:0}).sort({id:-1}).limit(1);
            
            const salt = await bcrypt.genSalt(10);
            let userPassword = await bcrypt.hash(password, salt);
    
    
            //내가 원하지 않는 동명의 다른 주소의 위치가 저장될 수 있음 => 선택지를 주고 선택
    
            await getCoord(lockerName).then(x=>{
                let arr = x;
                let msg;
                let locker
                    for(let i = 0; i<arr.length ; i++){
                        if(arr[i].address_name === address || arr[i].road_address_name === address){
                            msg = "등록 성공"
                            locker = new Locker({ 
                                        id: lastId.id+1,
                                        stationName: lockerName,
                                        userName, 
                                        password: userPassword, 
                                        address, 
                                        location, 
                                        price, 
                                        numberOf,
                                        longitude: arr[i].x,
                                        latitude: arr[i].y,
                                    });
                            
                            locker.save();
                            break;
                        }
                        else{
                            msg = "주소를 다시 확인해주세요."
                        }
                    }
                    if(locker){
                        return res.send(alertMove("/",msg));
                    }else{
                        return res.send(alertMove("./",msg));
                    }
            });
        }

    }
    catch(e){
        console.log(e);
        return res
            .send(alertMove("/routes/add","등록 실패"));
    }
}

const array = async function(arr){
    for(let i = 0;i<api.length;i++){
        await getCoord(api[i].stationName + api[i].line).then(x=>{
            x.floor = api[i].floor
            x.line = api[i].line
            x.size = api[i].size
            x.location = api[i].location
            x.price = api[i].price
            x.numberOf = api[i].numberOf
            x.id = i
            arr.push(x)
            })
    }
return arr
}

let list = []

let lockerGet = async (req, res) => {
    try {
      const locker = await Locker.find({});
      res.status(200).send(locker);
      console.log("get")
    } catch (e) {
        console.log(e);
      res.status(500).json({
        message: "조회 실패",
      });
    }
};

let lockerPost =  async (req,res)=>{
try{
    await array(list).then(x=>
        Locker.insertMany(x,{ordered:false}).then(function(){
            console.log("success")
        }).catch(function(err){
            if(err.code===11000){
                console.log("id가 중복된 도큐먼트가 있습니다.")
            }
            else{
                console.log(err)
            }
        })
    )
    res.status(204).send();
    console.log("post")
}
catch(e){
    console.log(e)
    res.status(500).json({
        message: "저장 실패"
    })
}
}

let loginGet = async(req, res)=>{
      if(req.session.user){
        console.log(req.session.user);
        return res
          .send(alertMove("/","이미 로그인 되어있습니다."))
      }
      req.session.prevPage = req.headers.referer
      res.render("login",{})
    }

let loginPost = async (req, res) => {
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
            console.log(req.session.user);
            if(req.session.prevPage === "http://localhost:3000/routes/login") return res.redirect("/")
            return res.redirect(req.session.prevPage);
            
          }else{
            return res
              .status(400)
              .send(alertMove("/routes/login","등록되지 않은 회원입니다."))
          }
               
          }catch(err){
            console.log(err);
            return res.status(400).send({ err: err.message });
          }
    };
  
let logoutGet = async(req, res)=>{
        if(req.session.user){
          req.session.destroy(() => {
            req.session;
          });
          console.log(req.session);
          res.redirect('/');
        }
      }

let registerGet = async(req,res)=>{
          res.render("register",{
  
          })
}    
  
let registerPost =  async (req, res) => {
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
};
    

export {indexGet, indexPost, addGet,addPost,lockerGet,lockerPost,loginGet,loginPost,logoutGet,registerGet,registerPost}
