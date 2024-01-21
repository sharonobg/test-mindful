import connect from "../../../libs/mongodb";
import{verifyToken} from '../../../libs/jwt'
import {NextResponse} from "next/server";
import Transaction from "../../../models/transactionModel";
//import Category from "../../../models/categoryModel";
import {getServerSession} from "next-auth"
import {authOptions}from"../auth/[...nextauth]/route"

export async function GET(request,params){
    //send data as JSON
    try{
        //await connect();
        const yeardate = params
        const session = await getServerSession(authOptions);
        const sessionUser = session?.user?._id;
        console.log('yeardate',yeardate)
        const transactions= await Transaction.aggregate([
          { $match: {
              $expr : { $eq: [ '$authorId' , { $toObjectId: sessionUser } ] } 
          }},
           {
              "$lookup": {
                "from": "categories",
                "let": {
                  categoryId: {
                   "$toObjectId": "$categoryId"
                  }
                },
                "pipeline": [
                  {
                    $match: {
                      $expr: {
                        $eq: [
                          "$_id",
                          "$$categoryId",
                        ]
                      }
                    }
                  },
                  {
                    $project: {
                      _id:0,
                      day : {$dayOfMonth : "$transdate"},
                      month : {$month : "$transdate"}, 
                      year : {$year :  "$transdate"},
                      "transdate":1,
                     "descr":1,
                     categoryid:"$categoryId",
                     title: { $toLower : '$title' },
                      //title: 1,//category title,
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
                $addFields: {
                  month_date: {"$month": new Date() } 
                  }
              },
            {
              $project: {
                "transdate":1,
                "descr":1,
                "acctype":1,
                day : {$dayOfMonth : "$transdate"},
                month : {$month : "$transdate"}, 
                year : {$year :  "$transdate"},
                categoryid:"$categoryId",
                title: { $toLower : "$category.title" },
                "amount":1,
                month_date:1
              }
              
            },
        {
          "$sort": {
            "year": -1,
            "month":-1
          }
      }
          
      ])
      //console.log('transactions from route',transactions)
      return NextResponse.json(
        {transactions},
        {message: "Transactions list works"},
        {status: 201}
    )
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
        console.log('body fr route',body)//ok
        const newTransaction = await Transaction.create(body);
        console.log('newTransaction fr route',newTransaction)
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

