"use client"

import React,{useState,useEffect} from 'react';
import {useRouter} from 'next/navigation';
import {ToastContainer ,toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {useSession} from 'next-auth/react'
//import Transaction from '../models/transactionModel';
//import Category from '../models/categoryModel';


const CreateTransaction = () => {
    /*const [transdate,setTransdate]= useState("")*/
    const [descr,setDescr]= useState("")
    const [acctype,setAcctype]= useState("")
    /*const [categoryTitle,setCategoryTitle]= useState("")
    const [categoryId,setCategoryId]= useState("")*/
    const [amount,setAmount]= useState("")
    const {data:session,status} = useSession();
    const router= useRouter();
    /*const [categories,setCategories]=useState([])*/


    //if(status === 'loading'){
    //    return <p>Loading...</p>
    //}
    if(status === 'unauthenticated'){
        router.push('/')
        return <p className="font-bold text-red-500">Access Denied</p>
    }

    const handleSubmit = async (e) => {
        
        e.preventDefault();
        if( !descr){
            toast.error("Please fill in all the fields")
            return
        }
        try{
            const res = await fetch('http://localhost:3000/api/transaction',{
                headers:{
                    "Content-type":"application/json",
                    "Authorization":`Bearer ${session?.user?.accessToken}`
                },
                method:'POST',
                body:JSON.stringify({descr,acctype,authorId:session?.user?._id})
            })
            console.log('res with fetch: ',res)
            if(!res.ok){
                //toast.error('did not work')
                new Error("Error on auth")
            }
            const transaction = await res.json();
           
            //toast.success("Success!")
            router.push(`/transaction/${transaction?._id}`)
        }catch (error) {

        }
    }
    
    
    /*useEffect(() => {
        fetch('/api/category')
          .then((res) => res.json())
          .then(({categories}) => {
            setCategories(categories)
            //setLoading(false)
          })
      }, [])*/

      //if (!categories) return <p>no categories</p>
     //console.log('categories: ',categories)
    // const handleSelect = async (e) => {
    //    e.preventDefault();
    //    //const thisCatId = CategoryId.find({"title":e.target.value})
    //    //setCategoryId(thisCatId._id)
    //}
    return(
        <>
        <div className="flex flex-col w-full place-items-center border-l-orange-100">
            <form onSubmit={handleSubmit} className="flex flex-col flex-wrap gap-5 my-3">
            {/*<input onChange={(e) => setTransdate(e.target.value)}
                name="transdate"
                placeholder="Transaction Date"
                type="date"
                />*/}
                <input onChange={(e) => setDescr(e.target.value)}
                name="description"
                placeholder="Description"
                type="text"
                />
                <select type="text" value ={acctype} onChange={(e) => setAcctype(e.target.value)}>
                <option value="debit">Debit</option>
                <option value="cash">Cash</option>
                <option value="bank_account">Bank Account</option>
                <option value="other">Other</option>
                </select>
                
                {/*<select onChange={(e) => setCategoryTitle(e.target.value)}>
                    {categories?.length > -1 ? 
                    (categories.map((category) => 
                        <option key={category._id} id={category._id} value={category.title}>{category.title}</option>

                   ) ): "no categories are available"}</select>*/}
                <input onChange={(e) => setAmount(e.target.value)}
                name="amount"
                placeholder="0.00"
                type="number"
                required
                min="0"
                step=".01"
                
                />
                
                
                <button className="bg-blue-400 rounded-md p-3 text-white font-semibold" type="submit">Create Transaction</button>
            </form>
        </div>
        <ToastContainer />
        </>)
}
export default CreateTransaction