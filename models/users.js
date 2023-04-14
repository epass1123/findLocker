import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'
const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    id:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
    },
    email:{
        type:String,
    },
});

const user = mongoose.model("User",userSchema);

export default user