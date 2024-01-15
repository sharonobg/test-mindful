"use client"
import connect from '../libs/mongodb'
import Link from "next/link"
import {signIn,signOut,useSession} from 'next-auth/react';
import {useEffect,useState}from 'react'


export default function CategoriesList() {
    //connect();
const {data:session}= useSession();
//const categories = getCategories();
    const [email, setEmail] = useState();
    const [categories, setCategories] = useState();
    useEffect(() => {
        fetch("/api/category")
          .then((res) => res.json())
          .then((categories) => setCategories(categories));
          console.log('categories from client: ',categories)
      }, []);
    //const {categories} = await getCategories();
    
    return(

       <>
       {session ? <div>You are logged in as : {email}</div>:'not logged in yet'}
       <div>Categories:</div>
       {categories?.length > -1 ? (categories.map((category) => 
        <div key={category._id} className="flex flex-col place-items-center w-[50%] min-h-[50%]">
            <div className="flex border border-collapse border-blue-600 p-0 gap-2 my-0 items-start justify-between"> 
                <div className="flex flex-row items-start border border-amber-500">
                    <div className="border border-amber-500 w-[200px] py-2">{category.title}</div>
                </div>
                </div></div>)):("no categories available")
                
                }
        
        </>
        
    )
}