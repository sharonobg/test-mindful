"use client"

import React, {useState,useEffect} from 'react'
import {useSession}from 'next-auth/react';
import {useRouter} from 'next/navigation'
import {ToastContainer ,toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const Edit = (ctx) => {
    //let newdate = new Date().toISOString//();
    //console.log('newdate',newdate)
    const [transactionDetails,setTransactionDetails]=useState("");
    const [transdate,setTransdate]= useState(new Date())
    const [descr,setDescr]= useState("")
    const [acctype,setAcctype]= useState("")
    const [categories,setCategories]=useState([])
    //const [categoryTitle,setCategoryTitle]= useState("")
    const [categoryId,setCategoryId]= useState("")
    const [amount,setAmount]= useState("")
    const {data:session,status} = useSession();
    const router= useRouter();
    /*const [categories,setCategories]=useState([])*/

useEffect(() => {
    
    fetch('http://localhost:3000/api/category')
      .then((res) => res.json())
      .then(({categories}) => {
        setCategories(categories)
        //setLoading(false)
      })
  }, [])
useEffect(() => {
    //const id = ctx.params.id
   async function fetchTransaction(){                        
       const res = await fetch(`http://localhost:3000/api/transaction/${ctx.params.id}`,{cache:'no-store'})
       
       const transaction = await res.json()
       console.log('transaction after await res',transaction)
       const dataamount=transaction.amount.$numberDecimal;
       setTransactionDetails({
            transdate:transaction.transdate,
            //transdate:transdate,
            descr:transaction.descr,
            acctype:transaction.acctype,
            categoryId:transaction.categoryId,
            amount: dataamount,
            //amount: transaction.amount,
            authorId:session?.user._id
        }
    )}
   session && fetchTransaction()
  
},[session])
//console.log('transactionDetails after set: ',transaction)
if(status === 'loading'){
    return <p>Loading...</p>
}
if(status === 'unauthenticated'){
    
    return <p className="font-bold text-red-500">AccessDenied</p>
}
const handleSubmit= async (e) => {
    e.preventDefault();
    
    if(!descr){
        toast.error("Please fill in all the fields")
        return
    }
    try{
        //const id = ctx.params.id;
        const body = {transdate,descr,acctype,categoryId,amount}
        console.log('body: ',body)
        const res = await fetch(`http://localhost:3000/api/transaction/${ctx.params.id}`,{
    
        headers: {
            "Content-Type": 'application/json',
            "Authorization": `Bearer ${session?.user?.accessToken}`
        },
        method: "PUT",
        //body: JSON.stringify(body)
        body:JSON.stringify({
            transdate:new Date(transdate),
            descr,
            //categoryTitle,
            acctype,
            amount:parseFloat(amount).toFixed(2),
            authorId:session?.user?._id,
            categoryId
            //categoryId:ObjectId(categoryId)
        })
        
    })
    console.log('res after edit:',res)
    if(res.ok){
        console.log("Edit went through")
    }else{
        toast.error("Edit failed")
        console.log("Edit failed")
    }
    const transaction = await res.json();
    console.log('transaction edit: ',transaction);
    router.push("/");
    }catch(error){
        console.log(error)
    }
}
return(
    <>
        <div className="flex flex-col w-full place-items-center border-l-orange-100">
            <h2>Edit Transaction</h2>
            <form onSubmit={handleSubmit} className="flex flex-col flex-wrap gap-5 my-3">
                <DatePicker value={transdate} classname="border border-blue-600" selected={transdate} onChange={(date) => setTransdate(new Date(transdate))} />
                <input onChange={(e) => setDescr(e.target.value)}
                className="px-4 py-2 mt-4 mx-5 border border-green-200 text-green-500"
                name="description"
                placeholder="Description"
                type="text"
                value={descr}
                />
                <select onChange={(e) => setCategoryId(e.target.value)}
                className="px-4 py-2 mt-4 mx-5 border border-green-200 text-green-500"
                name="categoryId"
                placeholder="Category"
                type="text"
                value={categoryId}
                >
                    {categories?.length > -1 ? 
                    (categories.map((category) => 
                        <option key={category._id} id={category._id} value={category.title}>{categoryId}</option>

                   ) ): "no categories are available"}</select>
                <select type="text" value ={acctype} onChange={(e) => setAcctype(e.target.value)}>
                <option value="debit">Debit</option>
                <option value="cash">Cash</option>
                <option value="bank_account">Bank Account</option>
                <option value="other">Other</option>
                </select>
                
                <input onChange={(e) => setAmount(e.target.value)}
                name="amount"
                placeholder="0.00"
                type="string"
                value={amount}
                />
                <button className="bg-blue-400 rounded-md p-3 text-white font-semibold" type="submit">Edit Transaction</button>
            </form>
            
        </div>
        <ToastContainer />
    </>
)
}
export default Edit
