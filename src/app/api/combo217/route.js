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
        //const ObjectId = mongoose.Schema.Types.ObjectId
//const ids = ['categoryId', 'mycategories.mycategoryId'].map(id => ObjectId(id))
//const pipeline = [{$match: {_id: {$in: ids }}}]
        const transactionstotal= await Transaction.aggregate([
            //{ $match: { $expr : { $eq: [ '$authorId' , { $toObjectId: sessionUser } ] } } },//WORKS!!
            { $match: {
                //"categoryId": { $exists: true, },
                 $expr : { $eq: [ '$authorId' , { $toObjectId: sessionUser } ] } 
            }},
            
            
            {
                $lookup: {
                  from: "categories",
                  //localField: "_id",
                  //foreignField: "categoryId",
            
                  // as: "category",
                  let: {
                    //title:"$category.title"
                    categoryId: { $toObjectId:"$categoryId"},
                  },
                  pipeline: [
                    {
                      $match: {
                        $expr: {
                          $eq: ["$_id", "$$categoryId"],
                        },
                      },
                    },
                    {
                      $project: {
                        categoryId: 1,
                        title: 1,
                      },
                    },
                  ],
                  as: "category",
                },
              },
              {
                $lookup: {
                  from: "spendingplans",
                  // localField: "authorId",
                  // foreignField: "authorId",
                  let: {
                    //categoryTitle: "$title",
                    authorId: "$authorId",
                    month: {
                      $month: "$transdate",
                    },
                    year: {
                      $year: "$transdate",
                    },
                    categoryId: "$categoryId",
                  },
                  pipeline: [
                    {
                      $match: {
                        $expr: {
                          $eq: ["$authorId", "$$authorId"],
                        },
                      },
                    },
                    {
                      $addFields: {
                        planmonth: {
                          $month: "$planmonthyear",
                        },
                        planyear: {
                          $year: "$planmonthyear",
                        },
                      },
                    },
                    // {
                    //   $match: {
                    //     $expr: {
                    //       $eq: [
                    //         {
                    //           //$toObjectId: "$mycategories.0.mycategoryId"
                    //         },
                    //         "$$categoryId",
                    //       ],
                    //     },
                    //   },
                    // },
                    {
                      $addFields: {
                        mycategories_details: {
                          $arrayElemAt: ["$mycategories", 0],
                        },
                      },
                    },
                    // {
                    //   "$set": {
                    //       "mycategories_details.checkfilter": {
                    //         "$filter": {
                    //           "input": "$mycategories_details",
                    //           "as": "mycats",
            
                    //            elementExists: {
                    //         $cond: [
                    //           {
                    //             $in: [
                    //               "$$categoryId",
                    //               "$$mycats.mycategoryId",
                    //             ],
                    //           },
                    //           true,
                    //           false,
                    //         ],
                    //       },
            
                    //         }
                    //       },
                    //   }
                    // },
                    {
                      $project: {
                        title: "$category.title",
                        //mycategories_details:1,
                        categoryId: "$$categoryId",
                        //title:"$category.title",
                        month: "$$month",
                        year: "$$year",
                        categoryTitle: "$categoryTitle",
                        planmonth: 1,
                        planyear: 1,
                        spendingplans_details: 1,
                        //mycategories_details: 1,
                        mycategories: 1,
                      },
                    },
                    {
                      $match: {
                        $expr: {
                          $and: [
                            {
                              $eq: ["$planmonth", "$month"],
                            },
                            {
                              $eq: ["$planyear", "$year"],
                            },
                          ],
                        },
                      },
                    },
                  ],
                  as: "spendingplans_details",
                },
              },
              {
                $project: {
                  //categoryId: "$categoryId",
                  month : {$month : "$transdate"}, 
                  year : {$year :  "$transdate"},
                  title: "$category.title",
                  spendingplans_details: 1,
                  amount: {
                    $sum: "$amount",
                  },
                },
              },
              {
                $group: {
                  _id: {
                    year: "$year",
                    month: "$month",
                    planmonth: "$planmonth",
                    planyear: "$planyear",
                    categoryTitle: "$title",
                    categoryId: "$categoryId",
                    spendingplans_details:
                      "$spendingplans_details",
                  },
                  amount: {
                    $sum: "$amount",
                  },
                },
              },
              {
                $sort: {
                  year: -1,
                  month: -1,
                },
              },
          
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