import mongoose from 'mongoose';

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
    authority:{
        type:String,
        default:"일반"
    }
});

const user = mongoose.model("User",userSchema);

export default user