import bcrypt from "bcryptjs";
import mongoose, {Schema,Document} from "mongoose";

export interface IUser extends Document{
    username:string;
    fullname:string;
    email:string;
    role:string
    password:string;
    refreshToken:string;
    mobileNumber:number;
}

const userSchema:Schema<IUser> = new Schema({
    username:{
        type:String,
        required:[true,"username is required"],
        unique:[true,"username should be unique"],
        trim:true,
        index:true
    },
    fullname:{
        type:String,
        required:[true,"fullName is required"],
        trim:true
    },
    email:{
        type:String,
        required:[true,"email is required"],
        unique:[true,"email is already exist"],
        trim:true,
        match:[/.+\@.+..+/,"plese use a valid email address"]
    },
    mobileNumber:{
        type:Number,
        trim:true,
        required:true,
        unique:true
    },
    role:{
        type:String,
        enum:["user","admin"],
        default:"user"
    },
    password:{
        type:String,
        required:[true,"password is required"],
        trim:true
    },
    refreshToken:{
        type:String,
        trim:true
    },
},{
    timestamps:true
})

userSchema.pre("save",async function(next:any){
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password,10)
    next()
})


let User: mongoose.Model<IUser>;
try {
    // If the model is already compiled, use it. This guards against Next.js
    // Fast Refresh / module reloading which can attempt to redefine models.
    User = mongoose.model<IUser>("User");
} catch (e) {
    User = mongoose.model<IUser>("User", userSchema);
}

export default User;