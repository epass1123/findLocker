import express from "express";
import User from "../models/users.js";
const router = express.Router();

router.get('/',
    async (req,res)=>{
        res.render("user/index")
    }
)

router.post('/',
    async (req,res)=>{

    }
)

export default router;