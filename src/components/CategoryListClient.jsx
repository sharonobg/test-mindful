"use client"
import connect from '../libs/mongodb'
import {useSession} from 'next-auth/react';
import {useEffect,useState}from 'react'


export default function CategoriesList() {
    //connect();
const {data:session}= useSession();
//const categories = getCategories();
    const { status } = useSession();
    const [category, setCategory] = useState([]);
    const [categories, setCategories] = useState([]);
    const [title, setTitle] = useState("");
    useEffect(() => {
        async function getCategoryList(){
           const res = await fetch(`http://localhost:3000/api/category`,{
            method: "GET",
            //body:JSON.stringify({
            //    category
            //})
           });
           console.log('res after fetch',res)
            const categories = await res.json();
            //setCategories(categories);
            console.log('categories use effect: ',categories)//good to here
        }
        getCategoryList()
    },[])
   //const userEmail = setEmail(email);
    const categorieslist = setCategories(categories);
    console.log('categorieslist: ',categorieslist)
    return(

       <>
       {/*{session ? `<div>You are logged in as : ${session?.user?.email}</div>`:'not logged in yet'}*/}
       <div>Categories:</div>
       <select onChange={(e) => setCategory(e.target.value)}>
        <option value="style">style</option>
        <option value="fashion">fashion</option>
        <option value="food">food</option>
        <option value="culture">culture</option>
        <option value="travel">travel</option>
        <option value="coding">coding</option>
      </select>
        {/*{categorieslist.map((category) => 
        <div key={category._id} className="flex flex-col place-items-center w-[50%] min-h-[50%]">
            <div className="flex border border-collapse border-blue-600 p-0 gap-2 my-0 items-start justify-between"> 
                <div className="flex flex-row items-start border border-amber-500">
                    <div className="border border-amber-500 w-[200px] py-2">{category?.title}</div>
                </div>
                </div></div>
       )
                }
                {categorieslist.map((category) =>
                <select value ={category?._id} onChange={(e) => setCategory(e.target.value)}>
                <option value={category._id}>{category.title}</option>
                
                </select>)}*/}
        
        </>
        
    )
}