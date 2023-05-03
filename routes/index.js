import express from "express";
import alertMove from "/Users/kim/Desktop/web/memosite/js/util/alertMove.js";
import Locker from '../models/lockers.js'
import User from '../models/users.js';
const router = express.Router();

router.get('/',async function(req,res){
    let list = await Locker.find({});
    if(req.session.user){
        const auth = req.session.user.authority;
        const fav = req.session.user.favorites;
        if(auth === "관리자"){
            res.render('index',{
                user: req.session.user,
                appkey: process.env.APPKEY,
                list: list,
                fav: fav,
                manager: true,
            })
        }
        else{res.render('index',{
            user: req.session.user,
            appkey: process.env.APPKEY,
            list: list,
            fav: fav,
            manager: false,
        })
        }
    }
    else{
        res.render('index',{
            user: null,
            appkey: process.env.APPKEY,
            fav: null,
            list: list
    })
}
});

//체크풀렸을때 지우기

router.post('/',async (req,res)=>{
    if(req.session.user){
        let favorites = await User.findOne({id:req.session.user.id}, 'favorites');
        favorites = favorites.favorites;
        const {checkbox, inpValue} = req.body
        console.log("즐겨찾기" + favorites)
        if(!checkbox){
            if(favorites.includes(inpValue)){
                favorites.splice(favorites.indexOf(inpValue), 1);
            }
            await User.findOneAndUpdate({id:req.session.user.id},{favorites:favorites});
        }
        else{
            if(!favorites.includes(inpValue)){
                favorites.push(inpValue)
                await User.findOneAndUpdate({id:req.session.user.id},{favorites:favorites});
            }
        }
        console.log("즐겨찾기 추가후" + favorites)

    }
    
})


export default router;