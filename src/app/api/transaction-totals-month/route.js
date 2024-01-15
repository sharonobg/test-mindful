//import connect from "../../../libs/mongodb";
import{verifyToken} from '../../../libs/jwt'
import {NextResponse} from "next/server";
import Transaction from "../../../models/transactionModel";
//import Category from "../../../models/categoryModel";
import {getServerSession} from "next-auth"
import {authOptions}from"../auth/[...nextauth]/route"


//import mongoose,{models,Schema} from "mongoose";


//helper to get category title- sample from stack:
//const test = async () => {
//    try {
//      let categoryId = await Category.findOne({name:"fruits"}).select("_id")
//        const productCat = await Product.find({category:categoryId}).populate(
//          "category"
//        ).lean()
//        console.log(productCat)
//    }catch(e) {
//  
//    }
//  }
 // test()

 

export async function GET(request){
    //send data as JSON
    
    try{
        //await connect();
        const session = await getServerSession(authOptions);
        const sessionUser = session?.user?._id;
        //console.log(sessionUser)
        
        const transactionstotal= await Transaction.aggregate([
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
                        month : {$month : "$transdate"}, 
                        year : {$year :  "$transdate"},
                        date:{
                          month : {$month : "$transdate"}, 
                          year : {$year :  "$transdate"},
                        },
                        title: 1,
                        amount:1
                      }
                    },
                    
                  ],
                  "as": "category"
                },
                
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
                  _id: 0,
                  month : {$month : "$transdate"}, 
                  year : {$year :  "$transdate"},
                  title: "$category.title",
                  descr: 1,
                  amount:{$sum: "$amount"},
                  month_date:1
                }
              },
              { $match: {
                //$in: [['$month' , 12 ], ['$month' , 1 ]]
                $expr : { $eq: [ "$month", "$month_date" ] } 
                }
              },
              
            //{ 
            //    $match: { $expr: { $eq: [ "$month", "$month_date" ] } }
            //},
            //{ $match: {
            //  //  //$in: [['$month' , 12 ], ['$month' , 1 ]]
            //    $expr : [ { "$month": "$date" }, { "$month": $currMonth } ] 
            //  //  }
            //  },
            //},
            //{
            //    "$sort": {
            //      "year": 1,
            //      "month":1
            //      //"name": 1
            //    }
            //},
            {
                "$group" : {_id: 
                  "$title"
                  ,"amount": {$sum: "$amount"}
                }//group category title 
                //"$group" : {_id: "$categoryId","amount": {$sum: "$amount"}}//this groups by descr
            }
            
          ])



            //console.log('transaction-totals',transactionstotal)
        
        return new Response(JSON.stringify(transactionstotal),{status:200})
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

