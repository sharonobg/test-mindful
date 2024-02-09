import connect from "../../../libs/mongodb";
import{verifyToken} from '../../../libs/jwt'
import {NextResponse} from "next/server";
import Category from "../../../models/categoryModel";
import {getServerSession} from "next-auth"
import {authOptions}from"../auth/[...nextauth]/route"

export async function GET(request){
    //send data as JSON
    try{
        //await connect();
        //const session = await getServerSession(authOptions);
        //const sessionUser = session?.user?._id;
        const categories= await Category.find().sort({ title: 1 });
        
        return NextResponse.json(
            {categories},
            {message: "Categories list works"},
            {status: 201}
        )
    }catch(error){
        return new Response(JSON.stringify(null), {status:500})
    }
}
//POST will be for the 5 extra categories - TODO
export async function POST(request){
    //await connect();
    const accessToken = request.headers.get("authorization")
    const token = accessToken.split(' ')[1];
    const decodedToken = verifyToken(token);
    if(!accessToken || !decodedToken){
        return new Response(JSON.stringify({error: "unauthorized (wrong or expired token)"}),{status:403})
    }
    try{
        const body = await request.json();
        const newCategory = await Category.create(body);
        return new Response(JSON.stringify(newCategory),{status: 201})
    }catch (error){
        return new Response(JSON.stringify(null),{status:500})
    }
}


