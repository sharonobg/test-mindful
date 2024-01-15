"use client"

import React,{useState} from 'react';
import {useRouter} from 'next/navigation';
import {ToastContainer ,toast} from 'react-toastify';
import {useSession} from 'next-auth/react'

export default function FilterTransaction ({ children })  {
    const router=useRouter();
    const getMonth = new Date().getMonth()+1
    const newD = new Date()
    //const month = newD.toLocaleString('default', { month: 'long' });
    const getYear = new Date().getFullYear()
    const getMonthYear = getMonth +', ' +getYear;
    
    const [fmonth,setFMonth]=useState(12)
    
    const filterResults = async (e) => {
        e.preventDefault();
    // if fmonth = the transaction month = show results = else hide results
    console.log('filters - filter month: ',fmonth)
    router.refresh() 
    }
    console.log('filter month: ',fmonth)
    console.log('new date: ',newD)

    const FilterProvider = ({ children, fmonth }) => (
        <FilterProvider fmonth={fmonth}>
            {children}
        </FilterProvider>
    )
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
        
        </>)
}
