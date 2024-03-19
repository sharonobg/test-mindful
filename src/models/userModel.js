import mongoose,{models,Schema} from "mongoose";
//user role- admin role
const UserSchema = new Schema(
    {
        username:{
            type: String,
            required: true,
            unique:true,
            min:8,
            max: 24,
           
        },
        role:{
            type:String,
            required:true,
            enum: [
                "admin_role",
                "user_role",
            ],
            default:"user_role"
        },
        email:{
            type: String,
            required: true,
            unique:true,
        },
        password:{
            type: String,
            required: true,
            min:12,
            max:64
        },
    },
    {timestamps: true}
);
const User = mongoose.models.User || mongoose.model("User", UserSchema);
export default User;