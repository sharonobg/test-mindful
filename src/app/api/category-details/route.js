import connect from "../../../libs/mongodb";
import{verifyToken} from '../../../libs/jwt'
import {NextResponse} from "next/server";
import Category from "../../../models/categoryModel";
import Transaction from "../../../models/transactionModel";
import {getServerSession} from "next-auth"
import {authOptions}from"../auth/[...nextauth]/route"

export async function GET(request){
    //send data as JSON
    try{
        //await connect();
        const session = await getServerSession(authOptions);
        //const sessionUser = session?.user?._id;
        //const categoryTitle= await Category.find({
        //    //_id:'6557ee4f7daed09d708eb054'
        //    _id:'6557ee4f7daed09d708eb054',
        //    title: "title"
        //});
        const categorytitle= await Category.aggregate([

            //{ $match: { $expr : { $eq: [ _id , { $toObjectId: "6557f0bd7daed09d708eb060" } ] } } },//WORKS
            {"$lookup": {
                "from": "Transaction",
                let: {
                  catid: "$categoryId"
                },
            }
        },
            {$project : {title:"$title"}
            },
          ])
        return NextResponse.json(
            {categorytitle},
            {message: "Title works"},
            {status: 201}
        )
    }catch(error){
        return new Response(JSON.stringify(null), {status:500})
    }
}