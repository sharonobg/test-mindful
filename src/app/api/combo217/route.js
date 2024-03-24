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
        const transactionstotal= await Transaction.aggregate([
            //{ $match: { $expr : { $eq: [ '$authorId' , { $toObjectId: sessionUser } ] } } },//WORKS!!
            { $match: {
                //"categoryId": { $exists: true, },
                 $expr : { $eq: [ '$authorId' , { $toObjectId: sessionUser } ] } 
            }},
            {
              $lookup: {
                from: "categories",
                let: {
                  categoryId: {
                    $toObjectId: "$categoryId",
                  },
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
                    $addFields: {
                      titleLower: {
                        $toLower: "$title",
                      },
                    },
                  },
                  {
                    $project: {
                      categoryId: 1,
                      title: 1,
                      titleLower: "$titleLower",
                    },
                  },
                ],
                as: "category",
              },
            },
            {
              $lookup: {
                from: "spendingplans",
                let: {
                  authorId: "$authorId",
                  month: {
                    $month: "$transdate",
                  },
                  year: {
                    $year: "$transdate",
                  },
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
                  {
                    $match: {
                      $expr: {
                        $and: [
                          {
                            $eq: ["$planmonth", "$$month"],
                          },
                          {
                            $eq: ["$planyear", "$$year"],
                          },
                        ],
                      },
                    },
                  },
                  {
                    $project: {
                      _id: 0,
                      date: {
                        mycategories: "$mycategories",
                        month: "$$month",
                        year: "$$year",
                        planmonth: "$planmonth",
                        planyear: "$planyear",
                        categoryId: "$categoryId",
                        categoryTitle: "$title",
                        titleLower: "$titleLower",
                      },
                    },
                  },
                  {
                    $replaceRoot: {
                      newRoot: "$date",
                    },
                  },
                ],
                as: "mycategories",
              },
            },
            {
              $unwind: {
                path: "$mycategories",
              },
            },
            {
              $project: {
                //setofspcat:"$setofspcat",
                categoryId: "$categoryId",
                month: {
                  $month: "$transdate",
                },
                year: {
                  $year: "$transdate",
                },
                title: "$category.title",
                titleLower: "$category.titleLower",
                //titleLower:{$toLower:"$category.title"},
                mycategories: "$mycategories.mycategories",
                planmonth: "$planmonth",
                planyear: "$planyear",
                //mycategory: "$mycategories.mycategoryId",
                amount: {
                  $sum: "$amount",
                },
              },
            },
            {
              $unwind: {
                path: "$mycategories",
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
                  titleLower: "$titleLower",
                  mycategories: "$mycategories",
                  categoryId: "$categoryId",
                  //mycategory: "$mycategoryId",
                  //mycategoryn:
                  //  "$mycategories.mycategoryId._id",
                },
                amount: {
                  $sum: "$amount",
                },
              },
            },
            {
              $project: {
                amount: "$amount",
                planamount: "$myplanamt",
                difference: {
                  $subtract: [
                    "$_id.mycategories.planamount",
                    "$amount",
                  ],
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