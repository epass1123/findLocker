import alertMove from "../../js/util/alertMove.js";
import User from '../../models/users.js';
import Locker from '../../models/lockers.js';

let indexGet = async (req,res)=>{
        if(!req.session.user){
            return res.
                send(alertMove("/routes/login","로그인이 필요합니다."));
        }
        else{
            if(req.session.user.authority === '관리자'){
                let users = await User.find({});
                let lockers = await Locker.find({});
                res.render(
                    "manage",
                    {
                        user: req.session.user,
                        users,
                        lockers
                    }
                )    
            }
        }
};

let indexPost = async (req,res)=>{ 
    if(req.session.user.authority === '관리자'){
        let { checked } = req.body;
        if(checked){
            if(typeof checked === "string"){
                await User.findOneAndDelete({id:checked});
            }
            else{
                for(let i = 0; i<checked.length;i++){
                    await User.findOneAndDelete({id:checked[i]});
                }
            }
                return res.
                    send(alertMove("/manage","회원삭제가 완료되었습니다."))            

        }
    }
};

let lockerGet = async (req,res) =>{
    if(!req.session.user){
        return res.
            send(alertMove("/routes/login","로그인이 필요합니다."));
    }
    else{
        if(req.session.user.authority === '관리자'){
            let users = await User.find({});
            let lockers = await Locker.find({});
            res.render(
                "manage/locker",
                {
                    user: req.session.user,
                    users,
                    lockers
                }
            )    
        }
    }
}
let lockerPost = async (req,res) =>{
    if(req.session.user.authority === '관리자'){
        let { checked } = req.body;
        if(checked){
            if(typeof checked === "string"){
                await Locker.findOneAndDelete({id:checked});
            }
            else{
                for(let i = 0; i<checked.length;i++){
                    await Locker.findOneAndDelete({id:checked[i]});
                }
            }
                return res.
                    send(alertMove("/manage/locker","보관함 삭제가 완료되었습니다."))            

        }
    }
}
let qnaGet = async (req,res) =>{

}
let qnaPost = async (req,res) =>{

}

export {indexGet,indexPost, lockerGet, lockerPost, qnaGet, qnaPost};