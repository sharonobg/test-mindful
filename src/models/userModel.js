import mongoose,{models,Schema} from "mongoose";

const UserSchema = new Schema(
    {
        username:{
            type: String,
            required: true,
            unique:true,
            min:8,
            max: 24
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