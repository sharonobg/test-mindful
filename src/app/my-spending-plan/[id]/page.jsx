"use client"

import React, {useState,useEffect} from 'react'
import {useSession}from 'next-auth/react';
import {useRouter} from 'next/navigation'
import Link from "next/link"
import { BsFillPencilFill } from 'react-icons/bs'
import { AiFillDelete } from 'react-icons/ai'
import {ToastContainer ,toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
//import RemoveSpendingplan from '../../../components/RemoveSpendingplan'


    
const Edit = (ctx) => {
    const [spendingplanDetails,setSpendingplanDetails]=useState([])
    const [categories,setCategories]=useState([])
    const [mycategories,setMycategories]=useState([])
    const [planmonthyear,setPlanmonthyear]=useState(new Date())
    const [planamount,setPlanamount]=useState("")
    const [mycategoryId,setMycategoryId]= useState("")
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
        //setLoading(false)
      })
  }, []);
useEffect(() => {
    
   async function fetchSpendingplan() {  
                         
       const res = await fetch(`http://localhost:3000/api/spending-plan/${ctx.params.id}`
       //,{cache:'no-store'}
       )
       const spendingplan = await res.json()
       //console.log('fetchSpendingPlan',spendingplan)
       const planmonthyearPrev = planmonthyear;
       const dataamount=mycategories.planamount.$numberDecimal;
       setSpendingplanDetails({
            planmonthyear:planmonthyearPrev,
            mycategoryId:mycategories.mycategoryId,
            planamount:mycategories.dataamount,
            mycategoryId:mycategories.mycategoryId,
            planamount:mycategories.dataamount,
            categorynotes: mycategories.categorynotes
            //authorId:session?.user._id
        })}
    fetchSpendingplan()
},[])
//console.log('spendingplanDetails after set: ',spendingplanDetails)
if(status === 'loading'){
    return <p>Loading...</p>
}
if(status === 'unauthenticated'){
    
    return <p className="font-bold text-red-500">AccessDenied</p>
}

const handleSubmit= async (e) => {
    e.preventDefault();
    try{
        //const id = ctx.params.id;
        const body = {
            planmonthyear,
            planamount,
            categorynotes
        }
        const res = await fetch(`http://localhost:3000/api/spendingplan/${ctx.params.id}`,{
    
        headers: {
            "Content-Type": 'application/json',
            "Authorization": `Bearer ${session?.user?.accessToken}`
        },
        method: "PUT",
        //body: JSON.stringify(body)
        body:JSON.stringify(body)
        
    })
    //console.log('res after edit:',res)
    if(res.ok){
        console.log("Edit went through")
    }else{
        toast.error("Edit failed")
        console.log("Edit failed")
    }

    const spendingplan = await res.json();
    console.log('spendingplan edit: ',spendingplan);
    router.push("/");
    }catch(error){
        console.log(error)
    }

    
}
const handleDeleteA= async (e) => {
    e.preventDefault();
    try{
        const id = ctx.params.id;
        //const body = {
        //    transdate,descr,acctype,categoryId,amount
        //}
        const res = await fetch(`http://localhost:3000/api/spendingplan/${ctx.params.id}`,{
    
        headers: {
            "Content-Type": 'application/json',
            "Authorization": `Bearer ${session?.user?.accessToken}`
        },
        method: "DELETE",
        //body: JSON.stringify(body)
        //body:JSON.stringify(body)
        
    })
    //console.log('res after edit:',res)
    if(res.ok){
        toast.success("Delete went through")
        console.log("Delete went through")
    }else{
        toast.error("Edit failed")
        console.log("Edit failed")
    }

    //const spendingplan = await res.json();
    //console.log('spendingplan edit: ',spendingplan);
    //router.push("/");
    }catch(error){
        console.log(error)
    }

    
}
const handleDelete = async (ctx) => {
    const id = ctx.params.id
    console.log(id)
        const confirmed = confirm("Are you sure?");
        if(confirmed){
            //ctx.params.id
            
            const res = await fetch(`http://localhost:3000/api/spendingplan/${ctx.params.id}`, {
                method: "DELETE"
            });
            if(res.ok){
                router.refresh();
            }
            
        }
    }

return(
    <>
        <div className="flex flex-col w-full place-items-center border-l-orange-100">
            <h2>Edit Spendingplan</h2>
            <form onSubmit={handleSubmit} className="flex flex-col flex-wrap gap-5 my-3">
             <DatePicker 
             value={spendingplanDetails.transdate}
             onChange={(date) => setTransdate(date)}
             classname="border border-blue-600" 
               />
                <input onChange={(e) => setDescr(e.target.value)}
                className="px-4 py-2 mt-4 mx-5 border border-green-200 text-green-500"
                name="description"
                placeholder="Description"
                type="text"
                defaultValue={spendingplanDetails.descr}
                />
                <select 
                onChange={(e) => setAcctype(e.target.value)}
                type="text" 
                value ={spendingplanDetails.acctype} 
                >
                <option value="debit">Debit</option>
                <option value="cash">Cash</option>
                <option value="bank_account">Bank Account</option>
                <option value="other">Other</option>
                </select>
                {/*<select onChange={(e) => setCategoryId(e.target.value)}
                className="px-4 py-2 mt-4 mx-5 border border-green-200 text-green-500"
                name="categoryTitle"
                placeholder="Category"
                type="text"
                value={spendingplanDetails.categoryId}
                >
                    {categories?.length > -1 ? 
                    (categories.map((category) => 
                        <option key={category._id} id={category._id} value={category._id}>{category.title} : {category._id}</option>

                   ) ): "no categories are available"}</select>*/}
                
                <input onChange={(e) => setPlanamount(e.target.value)}
                name="planamount"
                placeholder="0.00"
                type="string"
                defaultValue={spendingplanDetails.planamount}
                />
                <button className="bg-blue-400 rounded-md p-3 text-white font-semibold" type="submit">Edit Spendingplan</button>
            </form>
            <div className="flex gap-2 flex-row ">
                    {/*<div className="flex flex-row">
                        <Link className="flex flex-row gap-1" href={`/spendingplan/edit/${ctx.params.id}`}>Edit<BsFillPencilFill /></Link>
                    </div>*/}
                   {/*<RemoveSpendingplan id="" />*/}
                    <button onClick={handleDeleteA} className="flex flex-row gap-1" >Delete<AiFillDelete /></button>
                </div>
            
        </div>
        <ToastContainer />
    </>
)
}
export default Edit
