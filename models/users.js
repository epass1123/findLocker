import mongoose from 'mongoose';
import validator from 'validator';
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
        type:Number,
        required:true,
    },
    email:{
        type:String,
    },
});



const user = mongoose.model("User",userSchema);

export default user