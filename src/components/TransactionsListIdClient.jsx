"use client"

import React, {useState,useEffect} from 'react'
import {useRouter} from 'next/navigation'
import Link from "next/link"
import {useSession}from 'next-auth/react';
import { BsFillPencilFill } from 'react-icons/bs'
//import {headers} from "next/headers"
import RemoveTransaction from "../components/RemoveTransaction";

export default function getTransactionsFilter() {
    
  
    const [transdate,setTransdate]= useState(new Date())
    const [descr,setDescr]= useState("")
    const [acctype,setAcctype]= useState("")
    const [categories,setCategories]=useState([])
    //const [categoryTitle,setCategoryTitle]= useState("")
    const [categoryId,setCategoryId]= useState("")
    const [amount,setAmount]= useState("")
    const {data:session,status} = useSession();
    const router= useRouter();
//filter - default is current month but can select from a dropdown of all months


const getMonth = new Date().getMonth()+1
const newD = new Date()
//const month = newD.toLocaleString('default', { month: 'long' });
const getYear = new Date().getFullYear()
const getMonthYear = getMonth +', ' +getYear;
const [fmonth,setFMonth]=useState(getMonth)
const [transactions,setTransactions]=("");
const [data,setData]=useState(null)


async function getData() {

const getTransactionDetails = () => {
const response = fetch('http://localhost:3000/api/transaction/')
console.log('getData response',response)
return response;
}
useEffect(() => {
    getTransactionDetails()
    //getData()
    //async function fetchTransactions(index){                        
        //const res = await fetch('http://localhost:3000/api/transaction/')
         
         //const {transactions} = await res.json()
     
     //console.log('transactions client LIST after await res',categories)
     console.log('transactions client after await res',transactions)
     return data
 //}
 (async () => {
    const response = await getTransactionDetails();
    setData({
        id: response.data.data._id,
        descr: response.data.data.descr,
        transdate: response.data.data.transdate,
        month: response.data.data.month,
        year: response.data.data.year,
        acctype: response.data.data.acctype,
        title: response.data.data.title,
        amount: response.data.data.amount,
    })
    console.log(response.data)
 })
 //fetchTransactions()
 },[])
}
const filterResults = () => {
    const filterRes = async (e) => {
    e.preventDefault();
        setFMonth(fmonth)
        //setTransactions(transactions)
        // if fmonth = the transaction month = show results = else hide results
    
        //}
        console.log('filter month client: ',fmonth)
        //console.log('settransactions',transactions)
    }
}
    return(
        
       <>
 <div onSubmit={filterResults} className="flex flex-col w-full place-items-center border-l-orange-100">
            <h2>Filter by Month</h2>
            <form className="flex flex-col flex-wrap gap-5 my-3">
                
                <select type="text" value ={fmonth} onChange={(e) => setFMonth(e.target.value)}>
                <option value="1">January 2024</option>
                <option value="2">February 2024</option>
                <option value="12">December 2023</option>
                <option value="11">November 2023</option>
                </select>
                <button className="bg-blue-400 rounded-md p-3 text-white font-semibold" type="submit">Choose Month</button>
            </form>
        </div>


       <div className="mt-5 flex flex-col place-items-center">
       <h1>Transaction List</h1>
       <h2 className="pb-3">My Transactions: {getMonthYear}</h2>
       <h3>Choose another month:</h3>
       
       <div className="mt-5 bg-white  flex flex-row h-auto p-0 gap-2 my-0 border-2 border-collapse border-blue-600"> 
            <div className="font-bold border-collapse border-r-2 border-amber-500 w-[100px] p-2">Month/Year</div>
            <div className="font-bold border-collapse border-r-2 border-amber-500 w-[250px] p-2 flex-wrap">Description</div>
            <div className="font-bold border-collapse border-r-2 border-amber-500 w-[200px] p-2">Type of Account</div>
            <div className="font-bold border-collapse border-r-2 border-amber-500 w-[200px] p-2">Category</div>
            <div className="font-bold border-collapse border-r-2 border-amber-500 w-[150px] py-2">Amount</div>
            <div className= "font-bold w-[100px] py-2 flex flex-row justify-center gap-3">Edit/Delete</div>
        </div>
        {transactions?.length > -1 ?("found"):("not found")}
        {transactions?.length > -1 ?
         (transactions.map( (transactiongroup) => 
          
        <div key={transactiongroup.transaction._id} className="flex flex-col bg-white">
        
         
        {/*(*/}
            <div className="my2 flex flex-row h-auto p-0 gap-2 my-0 border-2 border-collapse border-blue-600"> 
            MONTH: {transactiongroup.transaction.month}
                <div className="border-collapse border-r-2 border-amber-500 w-[100px] p-2">{transactiongroup.transaction.month}/{transactiongroup.date.year}</div>
                <div className="border-collapse border-r-2 border-amber-500 w-[250px] p-2 flex-wrap">{transactiongroup.descr}</div>
                <div className="border-collapse border-r-2 border-amber-500 w-[200px] p-2">{transactiongroup.acctype}</div>
                <div className="border-collapse border-r-2 border-amber-500 w-[200px] p-2">{transactiongroup?.title}</div>
                <div className="border-collapse border-r-2 border-amber-500 w-[150px] py-2">{transactiongroup?.amount.$numberDecimal}</div>
                <div className= "w-[100px] py-2 flex flex-row justify-center gap-3">
                <Link className="flex flex-row gap-1 justify-center" href={`/transaction/${transaction?._id}`}><BsFillPencilFill /></Link>
                <RemoveTransaction className="flex flex-row gap-1 justify-center" id={transaction._id} />
                </div>
            </div>
        {/*    ):("no transactions for this month, please choose another")}*/}
        </div>
        
    
       )): "no transactions are available"}
       
       </div>
       </>
        
    )
}


