import mongoose,{Document,Schema} from "mongoose";


export interface IMsg extends Document{
    content:string;
    isDelete:boolean;
    email:mongoose.Types.ObjectId;
    createdAt:Date;
    updatedAt:Date;
}

const msgSchema:Schema = new Schema({
    content:{
        type:String,
        required:[true,"Content is required"],
        trim:true,
        minlength:[1,"Content must be at least 1 character long"],
    },
    email:{
        type:String,
        required:true
    },
    isDelete:{
        type:Boolean,
        default:false
    },
},{timestamps:true});

let Msg: mongoose.Model<IMsg>;
try {
    Msg = mongoose.model<IMsg>("Msg");
} catch (e) {
    Msg = mongoose.model<IMsg>("Msg", msgSchema);
}

export default Msg;