"use client"

import React,{useState,useEffect} from 'react';
import {useRouter} from 'next/navigation';
import {ToastContainer ,toast} from 'react-toastify';
import {useSession} from 'next-auth/react'


const SimpleFilterTransaction = () => {
//export default function FilterTransaction ()  {
    //get the year and the month - get the months up to the current month
    //get the previous year - get the months from the first month available to the end of the year
    //date details:
    const newD = new Date()
    const getMonth = new Date().getMonth()
    const monthLong = newD.toLocaleString('default', { month: 'long' });
    const getYear = new Date().getFullYear()
    //const getMonthYear = getMonth +', ' +getYear;
    const [transdate,setTransdate]= useState(new Date())
    const [categories,setCategories]=useState([])
    const [categoryId,setCategoryId]= useState("")
    const [filters,setFilters]=useState([])
    const [transactionstotal,setTransactionstotal]=useState([])
    const [fmonth,setFMonth]=useState('')
    const {data:session,status} = useSession();
    const router= useRouter();

    //list of options with current year, all months up to and including the current month.
    //create api endpoint to retrieve all transactions OR use the api/transaction already there 
    //get months with transaction transaction month/years in array by lookup then export only the month/date as array
    //set array into dropdown as options (see categories dropdown)
    //route push year and month to params for month selected
    //do same for Categories in params

    
        useEffect(() => {
            fetch('http://localhost:3000/api/newsimplefilter')
            .then((res) => res.json())
              .then((filters) => {
                console.log('filters: ',filters)
                setFilters(filters)
              })
            },[])

          useEffect(() => {
        
            fetch('http://localhost:3000/api/category')
              .then((res) => res.json())
              .then(({categories}) => {
                setCategories(categories)
                console.log('categories: ',categories)
              })
          }, [])
          
    const filterResults = async (e) => {
        e.preventDefault();
        params = searchParams;
        
        console.log('params: ',params)
        //console.log('categories: ',categories)
    // if fmonth = the transaction month = show results = else hide results
    //console.log('filters - filter month: ',fmonth)
    router.refresh() 
    }
    //console.log('filter month: ',fmonth)
    //console.log('new date: ',newD)

    //const FilterProvider = ({ children, fmonth }) => (
    //    <FilterProvider fmonth={fmonth}>
    //        {children}
    //    </FilterProvider>
    //)
    return(
        <>
        <div className="flex flex-col w-full place-items-center border-l-orange-100">
            <h2>Filter by Month</h2>
            <form className="flex flex-col flex-wrap gap-5 my-3">
            <h2>Filter by Category</h2>
                <select onChange={(e) => setCategoryId(e.target.value)}>
                    {categories?.length > -1 ? 
                    (categories.map((category) => 
                        <option key={category} value={category}>{category.title}</option>

                   ) ): "no categories are available"}</select>
                <select>
                  {filters?.length > -1 ? 
                  (filters.map((filter,index) =>
                  {return(
                    <option key={index} value={`${filter._id.month}${filter._id.year}`}>{filter._id.month}/{filter._id.year}</option>
                  )}
                    
                )): "no dates are available"}
                </select>
                
                <button className="bg-blue-400 rounded-md p-3 text-white font-semibold" type="submit">Choose Month</button>
            </form>
        </div>
        
        </>)
}
export default SimpleFilterTransaction
