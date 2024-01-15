//import connect from "../../../libs/mongodb";
import{verifyToken} from '../../../libs/jwt'
import {NextResponse} from "next/server";
import Transaction from "../../../models/transactionModel";
//import Category from "../../../models/categoryModel";
import {getServerSession} from "next-auth"
import {authOptions}from"../auth/[...nextauth]/route"
 
export async function GET(request){
    //send data as JSON
    
    try{
        //await connect();
        const session = await getServerSession(authOptions);
        const sessionUser = session?.user?._id;
        //console.log(sessionUser)
        
        const spendingtotal= await Transaction.aggregate([
            //{ $match: { $expr : { $eq: [ '$authorId' , { $toObjectId: sessionUser } ] } } },//WORKS!!
            { $match: {
                "categoryId": { $exists: true, },
                 $expr : { $eq: [ '$authorId' , { $toObjectId: sessionUser } ] } 
            }},
             //WORKS
             {
                "$lookup": {
                  "from": "categories",
                  "let": {
                    categoryId: {
                      //"$toObjectId": "$categoryId"
                      "$toObjectId": "$categoryId"
                    }
                  },
                  "pipeline": [
                    {
                      $match: {
                        $expr: {
                          $eq: [
                            "$_id",
                            "$$categoryId"
                          ]
                        }
                      }
                    },
                    {
                      $project: {
                        transdate:1,
                        descr: 1,
                        title: 1,
                        amount:1
                      }
                    }
                  ],
                  "as": "category"
                }
              },
              {
                "$unwind": "$category"
              },
              {
                $project: {
                  _id: 0,
                  month : {$month : "$transdate"}, 
                  year : {$year :  "$transdate"},
                  title: "$category.title",
                  descr: 1,
                  amount:{$sum: "$amount"}
                }
              },
            {
                "$group" : {
                    _id:{
                        month: "$month",
                        year: "$year",
                    }
                    ,"amount": {$sum: "$amount"}}//this groups by 
                //"$group" : {_id: "$categoryId","amount": {$sum: "$amount"}}//this groups by descr
            },
            {
                "$sort": {
                  "year": 1,
                  "month":1
                  //"name": 1
                }
              }
            
          ])



            //console.log('transaction-totals',transactionstotal)
        
        return new Response(JSON.stringify(spendingtotal),{status:200})
    }catch(error){
        return new Response(JSON.stringify(null), {status:500})
    }
}

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
        //console.log('body fr route',body)//ok
        const newTransaction = await Transaction.create(body);
        //console.log('newTransaction',newTransaction)
        return new Response(JSON.stringify(newTransaction),{status: 201})
       
    }catch (error){
        return new Response(JSON.stringify(null),{status:500,error})
    }
}
export async function DELETE(request){
    //send data as json
    const id = request.nextUrl.searchParams.get('id');
    //await connect();
    await Transaction.findByIdAndDelete(id);
    return NextResponse.json(
        
        {message: "Transaction deleted"},
        {status: 200}
    )
}

