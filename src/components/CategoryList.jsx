import Link from "next/link"
import {headers} from "next/headers"
import {HiPencilAlt} from "react-icons/hi";

const getCategories = async () => {
    
    try{
        const res = await fetch("http://localhost:3000/api/category",{
        method: "GET",
        headers: headers()
    });
    if(!res.ok){
        throw new Error("Failed to fetch categories");
    }
    
    return res.json()
}catch (error){
    console.log("Error finding categories",error)
}
}
export default async function CategoriesList() {
    const {categories} = await getCategories();
    console.log('categories: ',categories)
    return(

       <>
       <div className="my-4 flex flex-col place-items-center w-[50%] min-h-[50%] text-blue-400 underline"><Link className="p-0" href='/category-list'>
                        Add a category
                    </Link></div>
        {categories?.length > -1 ? (categories.map((category) => 
        <div key={category._id} className="flex flex-col place-items-center w-[50%] min-h-[50%]">
            <div className="flex border border-collapse border-blue-600 p-0 gap-2 my-0 items-start justify-between"> 
                <div className="flex flex-row items-start border border-amber-500">
                    <div className="border border-amber-500 w-[200px] py-2">{category.title}</div>
                </div>
                <div className="flex gap-2">
                    {/*<RemoveCategory id={category._id} />*/}
                    <Link className="p-0" href={`/addCategory/edit/${category._id}`}>
                        <HiPencilAlt size={24} />
                    </Link>
                </div>
            </div>
        </div>
       ) ): "no categories are available"}
        </>
        
    )
}