//import connect from "../../../libs/mongodb";
//import{verifyToken} from '../../../libs/jwt'
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
        const filters= await Transaction.aggregate([
          { $match: {
              $expr : { $eq: [ '$authorId' , { $toObjectId: sessionUser } ] } 
          }},
            //{
            //  $project: {
            //    "_id":1,
            //   // "transdate":1,
            //    month : {$toString:{$month : "$transdate"}}, 
            //    year : {$toString:{$year :  "$transdate"}},
            //    //month : {$month : "$transdate"}, 
            //    //year : {$year :  "$transdate"},
            //    
            //  }
            //  
            //},
            {
              $project: {
                transdate:1,
                descr: 1,
                month : {$month : "$transdate"}, 
                year : {$year :  "$transdate"},
                //month : {$toString:{$month : "$transdate"}}, 
                //year : {$toString:{$year :  "$transdate"}},
                date:{
                  month : {$month : "$transdate"}, 
                  year : {$year :  "$transdate"},
                },
                title: 1,
                amount:1,
                
                //doc_date:1
              }
            },
            
          //{
          //  "$group": {
          //    //_id:1,
          //    _id:
          //    {//date:"$date",
          //     year:"$year",
          //     month:"$month",
          //    },
          //},
        //},
        //{
        //  $project: {
        //    "_id":1,
        //   // "transdate":1,
        //    month : "$month", 
        //    year : "$year",
        //  },
        //  
        //},
          //{
          //  "$group":{
          //    _id:"$data.year"
          //  },
          //},
           ////{
           ////  "$sort": {
           ////    "year": 1,
           ////    //"month":-1
            //  }
            //}
            
            
          
      ])
      //let formattedResult = result.map(({data}) => data)
      //let filtersd = filters.map(({data}) => data)
      //console.log('transactions from route',transactions)
    //  return NextResponse.json(
    //    filters,
    //    {message: "Transactions Filter by Date"},
    //    {status: 201}
    //)
    //}catch(error){
    //    return new Response(JSON.stringify(null), {status:500})
    //}
    return new Response(JSON.stringify({filters}),{status:200})
    }catch(error){
        return new Response(JSON.stringify(null), {status:500})
    }
}



