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
            let list = await Locker.find({})
            
            res.render(
                "user/mylocker/favorites",
                {
                    user: req.session.user,
                    list
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
}
)

export default router;