"use client"

import React,{useState,useEffect} from 'react';
import {useRouter} from 'next/navigation';
import {ToastContainer ,toast} from 'react-toastify';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {useSession} from 'next-auth/react'
//this client page is used to edit planned spending amounts, add or remove categories, 
//show my categories with checkbox- user can uncheck category and amt 0. unless there is a previous amount stored in mongodb
//assign checked categories to user
//this will be the dropdown list in add-transaction unless user wants to add more- then click (popup category list? to add?)
//categories with an amount > 0 or previously checked will be checked on load. These will be retrieved for the transaction-titles-totals
//need section - available categories not in spending plan (could be via sort)
{/*export default function MySpendingPlan() {*/}
const createSpendingPlan = () => {
    const [categories,setCategories]=useState([])
    const [mycategories,setMycategories]=useState([])
    const [planmonthyear,setPlanmonthyear]=useState(new Date())
    const [planamount,setPlanamount]=useState("")
    const [categoryId,setCategoryId]= useState("")
    const [categorynotes,setCategorynotes]= useState("")
    const [categoryTitle,setCategoryTitle]= useState("")
    const [isChecked, setIsChecked] = useState(false);
    const {data:session,status} = useSession();
    const router= useRouter();
   
    useEffect(() => {
      fetch('http://localhost:3000/api/category')
        .then((res) => res.json())
        .then(({categories}) => {
          setCategories(categories)
        })
    }, [])
    if(status === 'loading'){
      return <p>Loading...</p>
  }
    if(status === 'unauthenticated'){
      return <p className="font-bold text-red-500">Access Denied</p>
  }
  const handleSubmit = async (event) => {
    event.preventDefault();
    try{
        //const amount = parseFloat(amount).toFixed(2);
        const res = await fetch('http://localhost:3000/api/spending-plan-alt',{
            method:'POST',
            headers:{
                "Content-type":"application/json",
                "Authorization":`Bearer ${session?.user?.accessToken}`
            },
            body:JSON.stringify({
                authorId:session?.user?._id,
                planmonthyear:new Date(planmonthyear),
                mycategories:{
                  mycategoryId:spendingplan.categoryId,
                  planamount:parseFloat(spendingplan.planamount).toFixed(2),
                  categorynotes: spendingplan.categorynotes
                }
                
                //isChecked,
                
                
            })
        })
        console.log('isChecked res',res);
        if(!res.ok){
            throw new Error("Error on spending plan or auth")
        }
        const spendingplan = await res.json();
        //console.log('transaction ln65',spendingplan)
        //router.push(`/spending-plan/${spendingplan?._id}`)
        router.refresh();
        router.push('/');
    }catch (error) {
      console.log('not working',error)
    }
}
    return(
        <>
        <div className="flex flex-col w-full place-items-center border-l-orange-100">
        <h2>Select categories for your spending plan</h2>
        <form onSubmit={handleSubmit} className="flex flex-col flex-wrap gap-5 my-3">
          {/*<div className="flex flex-col">*/}
            <DatePicker
                dateFormat="MMMM yyyy"
                showMonthYearPicker 
                selected={planmonthyear} 
                onChange={(date) => setPlanmonthyear(date)}
                />
              {categories?.length > -1 ? (categories.map((category) => 
                   <>
              <div key={category._id} className="flex flex-row m-0 py-0 px-2 items-center">      
              
              <input 
              //checked={setIsChecked(!isChecked)}
              onChange={(e) => setIsChecked(!isChecked)}
                className="m-0 py-0 px-2 w-fit align-items-center text-sm"
                name="checkbox"
                placeholder="Select Category"
                type="checkbox"
                />
                <label onChange={(e) => setCategoryId(e.target.value)} className="m-0 py-0 px-2 align-items-center">{category.title}</label>
                <input onChange={(e) => setCategorynotes(e.target.value)}
                className="px-4 py-2 mt-0 border border-green-200 text-green-500"
                name="category-notes"
                placeholder="Category Notes (for ex Mortgage: could be Chase"
                type="text"
                />
                <input onChange={(e) => setPlanamount(e.target.value)}
                className="px-4 py-2 mt-0 border border-green-200 text-green-500 w-fit"
                name="planned-amt"
                placeholder="0.00"
                //selected={planamount}
                type="string"
                />
                </div>
               

                </>) ): "no categories are available"}
                
              
              <button className="w-fit bg-blue-400 rounded-md p-3 text-white font-semibold" type="submit">Create Spending Plan</button>
              
          </form>
         
      </div>

       {/* </div>*/}
       <ToastContainer />  
        
        </>)
}
export default createSpendingPlan
