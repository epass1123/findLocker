import alertMove from "../../js/util/alertMove";
import User from '../../models/users.js';
import Locker from '../../models/lockers.js';
import bcrypt from 'bcrypt';

let indexGet = async (req,res)=>{
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
};

let indexPost = async (req,res)=>{
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
};

let modifyGet = async (req,res)=>{
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

let modifyPost = async (req,res)=>{ 
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
};

let withdrawlGet = async (req,res)=>{
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
};

let withdrawlPost = async (req,res)=>{ 
        if(req.session.user){
            let _id = req.session.user._id;
            await User.findByIdAndDelete(_id);
            req.session.user = undefined;
            return res
                .send(alertMove("/","회원탈퇴가 완료되었습니다."))
        }

};

let mylockerGet = async (req,res)=>{
        if(!req.session.user){
            return res.
                send(alertMove("/routes/login","로그인이 필요합니다."))
        }
        else{
            let myid = req.session.user.id
            let mylocker = await Locker.find({userName: myid});
            res.render(
                "user/mylocker/mylocker",
                {   
                    mylocker,
                    user: req.session.user,
                }
            )    
        }
};

let mylockerPost = async (req,res)=>{ 
        if(req.session.user){
            let { locker } = req.body;
            if(locker){
                if(typeof locker === "string"){
                    await Locker.deleteOne({stationName: locker});
                    return res.
                        send(alertMove("./mylocker","삭제가 완료되었습니다."))
                } 
                else{
                    for(let i = 0;i<locker.length;i++){
                        await Locker.deleteOne({stationName: locker[i]});
                    }
                    return res.
                        send(alertMove("./mylocker","삭제가 완료되었습니다."))
                }
            }
            console.log(locker)
        }

};

let favoritesGet = async (req,res)=>{
        if(!req.session.user){
            return res.
                send(alertMove("/routes/login","로그인이 필요합니다."))
        }
        else{
            let list = await Locker.find({})
            
            res.render(
                "user/mylocker/favorites",
                {
                    user: req.session.user,
                    list
                }
            )    
        }
};

let favoritesPost = async (req,res)=>{ 
    if(req.session.user){
        let { locker } = req.body;
        let _id = req.session.user._id
        let fav = req.session.user.favorites
        if(locker){
            if(typeof locker === "string"){
                fav.splice(fav.indexOf(locker),1);

                await User.updateMany({_id:_id},
                    {
                        $set:{
                            favorites : fav,
                        }
                    }
                );
            }
            else{
                locker.forEach(e=>{
                    fav.splice(fav.indexOf(e),1)
                })
    
                await User.updateMany({_id:_id},
                    {
                        $set:{
                            favorites : fav,
                        }
                    }
                );
            }
            req.session.user.favorites = fav;
                return res.
                    send(alertMove("./favorites","삭제가 완료되었습니다."))            

        }
    }
};

export {indexGet, indexPost, modifyGet, modifyPost, withdrawlGet, withdrawlPost, mylockerGet,mylockerPost,favoritesGet,favoritesPost};