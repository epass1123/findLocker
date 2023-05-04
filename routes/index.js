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

router.post('/',async (req,res)=>{
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
    
})


export default router;