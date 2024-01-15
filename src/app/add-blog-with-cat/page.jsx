"use client"

import React,{useState} from 'react';
import {useRouter} from 'next/navigation';
import {ToastContainer ,toast} from 'react-toastify';
import {useSession} from 'next-auth/react'

const CreateBlog = () => {
    const [title,setTitle]=useState("");
    const [description,setDescription]=useState("");
    const [category,setCategory]=useState("Food-in");
    const {data:session,status} = useSession();
    const router= useRouter();

    if(status === 'loading'){
        return <p>Loading...</p>
    }
    if(status === 'unauthenticated'){
        return <p className="font-bold text-red-500">Access Denied</p>
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        if(!title || !category || !description){
            toast.error("You r not done yet!")
            return
        }
        try{
            const res = await fetch('http://localhost:3000/api/blog',{
                headers:{
                    "Content-type":"application/json",
                    "Authorization":`Bearer ${session?.user?.accessToken}`
                },
                method:'POST',
                body:JSON.stringify({title,description,category,authorId:session?.user?._id})
            })
            if(!res.ok){
                throw new Error("Error on auth")
            }
            const blog = await res.json();
            router.push(`/blog/${blog?._id}`)
        }catch (error) {

        }
    }
    return(
        <>
        
        <div className="flex flex-col w-full place-items-center border-l-orange-100">
            <h2>Create Blog</h2>
            <form onSubmit={handleSubmit} className="flex flex-col flex-wrap gap-5 my-3">
                <input onChange={(e) => setTitle(e.target.value)}
                    className=""
                    name="blog-title"
                    placeholder="Blog Title"
                    type="text"
                />
                <textarea onChange={(e) => setDescription(e.target.value)}
                className="px-4 py-2 mt-4 mx-5 border border-green-200 text-green-500"
                name="description"
                placeholder="Description"
                type="text"
                />
                <select value ={category} onChange={(e) => setCategory(e.target.value)}>
                <option value="food_in">Food-in</option>
                <option value="food_out">Food-out</option>
                <option value="mortgage">Mortgage</option>
                <option value="entertainment">Entertainment</option>
                </select>
                <button className="bg-blue-400 rounded-md p-3 text-white font-semibold" type="submit">Create Blog</button>
            </form>
        </div>
        <ToastContainer />
        </>)
}
export default CreateBlog