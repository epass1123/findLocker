import express from "express";
import alertMove from "/Users/kim/Desktop/web/memosite/js/util/alertMove.js";
import User from '../../../models/users.js';
import Locker from '../../../models/lockers.js';
const router = express.Router();

router.get('/',
    async (req,res)=>{
        if(!req.session.user){
            return res.
                send(alertMove("/routes/login","로그인이 필요합니다."))
        }
        else{
            let arr = []
            let fav = req.session.user.favorites
            fav.sort();
            for(let i = 0;i<fav.length;i++){
                arr.push(await Locker.find(
                    {
                        id: Number(fav[i])
                    }
                ));

            }
            res.render(
                "user/mylocker/favorites",
                {
                    user: req.session.user,
                    arr
                }
            )    
        }
    }
)

router.post('/',
async (req,res)=>{ 
    if(req.session.user){
        let { locker } = req.body;
        let _id = req.session.user._id
        let fav = req.session.user.favorites
        if(locker){
            locker.forEach(e=>{
                fav.splice(fav.indexOf(e),1)
            })

            console.log("fav:", fav);
            await User.updateMany({_id:_id},
                {
                    $set:{
                        favorites : fav,
                    }
                }
            );

            req.session.user.favorites = fav;
            return res.
                send(alertMove("./favorites","삭제가 완료되었습니다."))            
        }
        console.log(locker)
    }

}
)

export default router;