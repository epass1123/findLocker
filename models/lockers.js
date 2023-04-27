import mongoose from 'mongoose';
import validator from 'validator';
const lockerSchema = new mongoose.Schema({
    id:{
        type:Number,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required: true,
        default: "관리자"
    },
    stationName:{
        type:String,
        trim:true,
        required: true,
        // unique:true,
    },
    userName:{
        type:String,
        required:true,
        default:"관리자"
    },
    line:{
        type:String,
    },
    floor:{
        type:String,
    },
    address:{
        type:String,
    },
    location:{
        type:String,
        required:true,
    },
    latitude:{
        type:Number,
        default:0
    },
    longitude:{
        type:Number,
        default:0,
    },
    size:{
        type:String,
        default:"기타", 
    },
    price:{
        type:String,
        validate(value){
            if(value<0){
                throw new Error("가격은 마이너스일 수 없음.")
            }
        }
    },
    numberOf:{
        type:Number,
        validate(value){
            if(value<0){
                throw new Error("보관함 수는 마이너스일 수 없음.")
            }
        }
    },

});



const locker = mongoose.model("Locker",lockerSchema);

export default locker