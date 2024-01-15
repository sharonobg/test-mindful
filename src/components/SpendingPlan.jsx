//import Link from "next/link"
//import { BsFillPencilFill } from 'react-icons/bs'
//import {HiOutlineTrash} from "react-icons/hi";
import {headers} from "next/headers"
//import {useSession} from 'next-auth/react'
//import Category from "../models/categoryModel";
//import RemoveTransaction from "../components/RemoveTransaction";
//filter - default is current month but can select from a dropdown of all months


const getTotals = async () => {
    try{
        const res = await fetch("http://localhost:3000/api/transactiontitle-totals",{
           cache: 'no-store',
           method: "GET",
           headers: headers(),
        });
        if(!res.ok){
            throw new Error("Failed to fetch transactions");
        }
        //console.log('res in route totals: ',res)
        //console.log('SpendingPlan Get Totals props ln 10',{props})
        return res.json();
    }catch(error){
        console.log("Error finding transactions",error)

    }
    
}
const getGrandTotals = async (props) => {
    try{
        const res = await fetch("http://localhost:3000/api/spending-totals-category",{
           cache: 'no-store',
           method: "GET",
           headers: headers(),
        });
        if(!res.ok){
            throw new Error("Failed to fetch transactions");
        }
        //console.log('grand totals res in route totals: ',res)
        //console.log('SpendingPlan Grand Totals props ln 10',{props})
        return res.json();
    }catch(error){
        console.log("Error finding transactions",error)
    }
}

export default async function SPCategoryView(props) {
    //const {transactions} = await getTransactions();
    //console.log("transactions",{transactions})
    const transactiontotals = await getTotals();
    const grandtotals = await getGrandTotals();
    const getMonth = new Date().getMonth()+1
   const newD = new Date()
   const month = newD.toLocaleString('default', { month: 'long' });
   const getYear = new Date().getFullYear()
   const getMonthYear = getMonth +'/' +getYear;
   console.log('SPCategoryView props ln 10',{props})
    //const updateMonth = 
    //console.log("transactiontotals",transactiontotals)
    return(
       <>
       <div className="my-5 flex flex-col place-items-center">
       <h1>SpendingPlan</h1>
       <h2>Month:{month}</h2>
       </div>
       <div className="my-5 flex flex-col place-items-center">
       <div className="flex flex-row  w-full min-h-[50%] bg-white">
        <div className="font-bold border border-amber-500 w-[200px] p-2 text-left">Notes</div>
        <div className="font-bold border border-amber-500 w-[200px] p-2 text-left">Category</div>
        <div className="font-bold border border-amber-500 w-[200px] p-2 text-left">Planned Amount</div>
        <div className="font-bold border border-amber-500 w-[200px] py-2">Actual Amount</div>
        <div className="font-bold border border-amber-500 w-[100px] p-2 text-left">Difference</div>
        <div className="font-bold border border-amber-500 w-[200px] p-2 text-left">Explain Diff</div>
        </div>
       {transactiontotals?.length > -1 ? (transactiontotals.map((transactiontotal) =>
        
        <div key={transactiontotal._id} className="flex flex-row  w-full min-h-[50%] bg-white">
        {  transactiontotal.month == `${props.fmonth}` &&
        <>

        <div className="border border-amber-500 w-[200px] p-2 text-left">{transactiontotal?.month}/{transactiontotal?.year}</div>
        <div className="border border-amber-500 w-[200px] p-2 text-left">{transactiontotal?.title}</div>
        <div className="border border-amber-500 w-[200px] p-2 text-left">Planned Amt</div>
        <div className="border border-amber-500 w-[200px] py-2">{transactiontotal?.amount.$numberDecimal}</div>
        <div className="border border-amber-500 w-[100px] p-2 text-left">Difference</div>
        <div className="border border-amber-500 w-[200px] p-2 text-left">Explain Diff</div>
        </> }
        </div>
   
       )):("cant find any totals")
       
       }
       {grandtotals?.length > -1 ? (grandtotals.map((grandtotal) =>
        
        <div key={grandtotal._id.month} className="flex flex-row  w-full min-h-[50%] font-bold mt-4 bg-white">
        {  grandtotal._id.month == `${props.fmonth}` &&
        <>
        <div className="border border-amber-500 w-[200px] p-2 text-left">{grandtotal._id.month}/{grandtotal._id.year}</div>
        <div className="border border-amber-500 w-[200px] p-2 text-left">GrandTotal:{grandtotal._id.month}/{grandtotal._id.year}</div>
        <div className="border border-amber-500 w-[200px] p-2 text-left">Plan Total</div>
        <div className="border border-amber-500 w-[200px] py-2">{grandtotal?.amount.$numberDecimal}</div>
        <div className="border border-amber-500 w-[100px] p-2 text-left">Difference</div>
        <div className="border border-amber-500 w-[200px] p-2 text-left">Explain Diff</div>
        </>}
        </div>
        
       )):("cant find any totals")
       
       }
       
        </div>
       </>
        
    )
}