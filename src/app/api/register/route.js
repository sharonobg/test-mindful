import connect from "../../../libs/mongodb";
import bcrypt from 'bcryptjs';
import User from "../../../models/userModel";
import {NextResponse} from "next/server";
//await connect();
export const POST = async (request) => {
        try{
        const reqBody = await request.json();
        const {username, email,password:pass} = await reqBody;
        await connect();
        const isExisting = await User.findOne({email});
        if(isExisting){
            return NextResponse.json(
                {error: "User already exists!"},
                { status: 400 }
              );
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(pass, salt);
        
        const newUser = new User({
            username, 
            //role,
            email, 
            password: hashedPassword
        })
        const savedUser = await newUser.save();
        
        return NextResponse.json({
            message: "New User created",
            success: true,
            savedUser,
          });
        } catch (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }
    
}