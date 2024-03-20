"use client"
import {useRouter} from 'next/navigation';
import {HiOutlineTrash} from "react-icons/hi";

export default function RemoveBtn({id}) {
    const router = useRouter();
    const removeTopic = async () => {
        const confirmed = confirm("Are you sure?");
        if(confirmed){
            //const res = await fetch(`http://localhost:3000/api/topics?id=${id}`, {
            const res = await fetch(`https://mindful-spending-22924.vercel.app/api/topics?id=${id}`, {
                
                method: "DELETE"
            });
            if(res.ok){
                router.refresh();
            }
            
        }
    };
    return (
        <button onClick={removeTopic}
            className="text-red-500 p-0 m-0">
            <HiOutlineTrash size={24} />
        </button>
    )
}