//import {headers} from "next/headers"

// const getCategories = async () => {
//     try{
//         const res = await fetch("https://sharonobrien.com/api/category",{
//            //cache: 'no-store',
//            method: "GET",
//            headers: headers(),
//         });
//         if(!res.ok){
//             throw new Error("Failed to fetch categories");
//         }
//         //console.log('route categories',{categories})
//         return res.json();
//     }catch(error){
//         console.log("Error finding categories",error)
//     }

// }

export default async function CategoryListing() {
    const categories= await Category.find().sort({ title: 1 });
    // const {categories} = await getCategories();
    // //console.log('categories: ',categories)

    return(
        <div className="my-5 flex flex-col place-items-center">
        {categories?.length > -1 ? (categories.map((category) => 
            <>
            <div key={category._id} className="flex flex-row  w-full min-h-[50%] bg-white">
                <div>{category.title}</div>
            </div>
            </>
            )):("cant find any categories")
       
    }
    </div>
    )
}