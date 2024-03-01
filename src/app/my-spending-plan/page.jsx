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
const CreateSpendingPlan = () => {
  const [selections,setSelections]=useState([])
  const[selectedcats,setSelectedcats]=useState([])
    const [category,setCategory]=useState("")
    const [categories,setCategories]=useState([])
    const [mycategories,setMycategories]=useState([])
    const [planmonthyear,setPlanmonthyear]=useState(new Date())
    const [planamount,setPlanamount]=useState("")
    //const [categoryId,setCategoryId]= useState("")
    //const [title,setTitle]=useState("")
    const [categorynotes,setCategorynotes]= useState("")
    const [mycategoryId,setMycategoryId]= useState("")
    const [isChecked, setIsChecked] = useState(false);
    const {data:session,status} = useSession();
    //const isCheckedId="";
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
  
  const handleCategory = async (e) => {
    //const target = e.target;
    const target = e.currentTarget;
    
    const catid = target.id;
    setSelectedcats(() => 
    target.checked ? [...selectedcats,catid]
    : selectedcats.filter((mycategory) => mycategory !== catid))
  //   let isChecked = e.target.checked;
  // if(isChecked){
  //    //alert(e.target.id);
  //    let isCheckedId = e.target.id
  //    console.log(isCheckedId)
    
  // }
    //const { value, isChecked } = e.target;

    //setIsChecked(() => e.target.checked)
    //setCategory(() => e.target.id);
    //setMycategoryId(() => {e.target.id})
    //mycategories.push(e.target.id)
  }
  const handleSelections = async (e) => {
    e.preventDefault();
    const target = e.currentTarget;
    const catsel = target.id
  setSelections([{
    mycategoryId:{catsel},
    categorynotes:{categorynotes},
    planamount:{planamount}
    //authorId:session?.user._id
}])
//setMycategories(current => [...current, selections]);
//setMycategories([{selections}]);
mycategories.push({selections})
console.log('set my categories',mycategories)
  }
 
  //setNames(current => [...current, 'Carl']);
  //push to mycategories
  const handleSubmit = async (event) => {
    event.preventDefault();
    try{
        //const amount = parseFloat(amount).toFixed(2);
        const res = await fetch('http://localhost:3000/api/spending-plan',{
            method:'POST',
            headers:{
                "Content-type":"application/json",
                "Authorization":`Bearer ${session?.user?.accessToken}`
            },
            body:JSON.stringify({
                authorId:session?.user?._id,
                planmonthyear:new Date(planmonthyear),
                mycategories:{
                  mycategoryId:spendingplan.mycategories.categoryId,
                  planamount:parseFloat(spendingplan.mycategories.planamount).toFixed(2),
                  categorynotes: spendingplan.mycategories.categorynotes
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

//console.log('categories',categories)

  console.log('selectedcats',selectedcats)
  console.log("isChecked", isChecked);
  console.log("category", mycategoryId);
  console.log('selections',selections)
  console.log('mycategories',mycategories)
  console.log(' ue mycategories', mycategories);


    return(
        <>
        <div className="flex flex-col w-full place-items-center border-l-orange-100">
        <h2>Select categories for your spending plan</h2>
        <div  className="flex flex-row">
        <div  className="flex flex-col border-r-2 border-blue-500">
        <div className="flex flex-col">
        {categories?.length > -1 ? (categories.map((category,index) =>
        <div key={index} className="flex flex-col m-0 py-0 px-2 items-center">     
        <label htmlFor={category._id} className="m-0 py-0 px-2 align-items-center">{category.title}
        <input 
        className="m-0 py-0 px-2 w-fit align-items-center text-sm"
        name="checkbox"
        placeholder="Select Category"
        type="checkbox"
        value={category._id}
        id={category._id}
        onChange={handleCategory}
        />
        </label>
        </div>
        )): "no categories are available"}
        
        </div>
      </div>
      <div  className="flex flex-col">
        <form  className="flex flex-col flex-wrap gap-5 my-3">
          <div  className="flex flex-col">
            <DatePicker
                dateFormat="MMMM yyyy"
                showMonthYearPicker 
                selected={planmonthyear} 
                onChange={(date) => setPlanmonthyear(date)}
                />
              {selectedcats?.length > -1 ? (selectedcats.map((mycategoryId,index) => 
                   <>
              <div key={index} className="mycategoryArr flex flex-row m-0 py-0 px-2 items-center"> 
                <input onChange={(e) => setMycategoryId(e.target.value)}
                value={mycategoryId}
                id={mycategoryId}
                className="px-4 py-2 mt-0 border border-green-200 text-green-500"
                name={mycategoryId}
                placeholder={mycategoryId}
                type="text"
                />
                <h2>{mycategoryId}{category.title}{category._id}</h2>
                <input onChange={(e) => setCategorynotes(e.target.value)}
                className="px-4 py-2 mt-0 border border-green-200 text-green-500"
                name="category-notes"
                placeholder="Category Notes (for ex Mortgage: could be Chase"
                type="text"
                />
                <h2>{categorynotes}</h2>
                <input onChange={(e) => setPlanamount(e.target.value)}
                className="px-4 py-2 mt-0 border border-green-200 text-green-500 w-fit"
                value={planamount}
                name="planned-amt"
                placeholder="0.00"
                //selected={planamount}
                type="string"
                />
                <h2>{planamount}</h2>
                <button onClick={handleSelections}>Set to plan</button>
                </div>
                </>) ): "no categories are available"}
                
              </div>
              <button className="w-fit bg-blue-400 rounded-md p-3 text-white font-semibold" type="submit">Create Spending Plan</button>
              
          </form>
          </div>
      </div>
</div>
    
       <ToastContainer />  
        
        </> )
}
export default CreateSpendingPlan
