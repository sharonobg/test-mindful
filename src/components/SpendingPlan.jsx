import {headers} from "next/headers"


const getTotals = async () => {
    try{
        const res = await fetch("http://localhost:3000/api/transactiontitle-totals",{
           cache: 'no-store',
           method: "GET",
           headers: headers(),
        });
        if(!res.ok){
            throw new Error("Failed to fetch transactions");
        }
        return res.json();
    }catch(error){
        console.log("Error finding transactions",error)

    }
    
}
const getGrandTotals = async (props) => {
    try{
        const res = await fetch("http://localhost:3000/api/spending-totals-category",{
           cache: 'no-store',
           method: "GET",
           headers: headers(),
        });
        if(!res.ok){
            throw new Error("Failed to fetch transactions");
        }
        return res.json();
    }catch(error){
        console.log("Error finding transactions",error)
    }
}
const getCategories = async () => {
    try{
        const res = await fetch("http://localhost:3000/api/category",{
           cache: 'no-store',
           method: "GET",
           headers: headers(),
        });
        if(!res.ok){
            throw new Error("Failed to fetch categories");
        }
        //console.log('route categories',{categories})
        return res.json();
    }catch(error){
        console.log("Error finding categories",error)
    }

}
export default async function SPCategoryView(props) {
    const {categories} = await getCategories();
    const transactiontotals = await getTotals();
    const grandtotals = await getGrandTotals();
    const getMonth = new Date().getMonth()+1
    const newD = new Date()
    const month = newD.toLocaleString('default', { month: 'long' });
    const getYear = new Date().getFullYear()
    const getMonthYear = getMonth +'/' +getYear;
    //let propscategory = ''| undefined;
    //if(`${props.category}` == undefined){
    // propscategory = undefined
    //}else{
    // propscategory = `${props.category}`
    //}

    
   //console.log('SPCategoryView grandtotals',grandtotals)
    return(
       <>
      
       <div className="my-5 flex flex-col place-items-center">
       <h1>Monthly Spending Plan:  {props.fmonth}/{props.fyear}<br />(note-cats not entered should be 0.00 all categories should show)</h1>
       </div>
       <div className="my-5 flex flex-col place-items-center">
       <div className="flex flex-row  w-full min-h-[50%] bg-white">
        <div className="font-bold border border-amber-500 w-[200px] p-2 text-left">Category Notes</div>
        <div className="font-bold border border-amber-500 w-[200px] p-2 text-left">Category</div>
        <div className="font-bold border border-amber-500 w-[200px] p-2 text-left">Planned Amount</div>
        <div className="font-bold border border-amber-500 w-[200px] py-2">Actual Amount</div>
        <div className="font-bold border border-amber-500 w-[100px] p-2 text-left">Difference</div>
        <div className="font-bold border border-amber-500 w-[200px] p-2 text-left">Explain Diff</div>
        </div>
        <div className="flex flex-row  w-full min-h-[50%] bg-white">
        <div className="font-bold border border-amber-500 w-[200px] p-2 text-left">Category Notes</div>
        <div className="font-bold border border-amber-500 w-[200px] p-2 text-left">Some Categoryu</div>
        <div className="font-bold border border-amber-500 w-[200px] p-2 text-left">150.00</div>
        <div className="font-bold border border-amber-500 w-[200px] py-2">0.00</div>
        <div className="font-bold border border-amber-500 w-[100px] p-2 text-left">150.00</div>
        <div className="font-bold border border-amber-500 w-[200px] p-2 text-left">not done</div>
        </div>
       
       {transactiontotals?.length > -1 ? (transactiontotals.map((transactiontotal,index) =>
        
        <div key={index} className="flex flex-row  w-full min-h-[50%] bg-white">
        
        { transactiontotal._id.year == `${props.fyear}` && transactiontotal._id.month == `${props.fmonth}` && (`${props.category}` == 'all-categories' ||  transactiontotal._id.title == `${props.category}`) && 
        <>
        <div className="border border-amber-500 w-[200px] p-2 text-left"></div>
        <div className="border border-amber-500 w-[200px] p-2 text-left">{transactiontotal?._id.title}</div>
        
        <div className="border border-amber-500 w-[200px] p-2 text-left">Planned Amt</div>
        <div className="border border-amber-500 w-[200px] py-2">{transactiontotal?.amount.$numberDecimal}</div>
        <div className="border border-amber-500 w-[100px] p-2 text-left">Difference</div>
        <div className="border border-amber-500 w-[200px] p-2 text-left">Explain Diff</div>
        </>  }
        </div>
   
       )):("cant find any totals")
       
       }
       {grandtotals?.length > -1 ? (grandtotals.map((grandtotal,index) =>
        
        <div key={index} className="flex flex-row  w-full min-h-[50%] font-bold bg-white">
        {  grandtotal._id.year == `${props.fyear}` && grandtotal._id.month == `${props.fmonth}` && `${props.category}` == 'all-categories' &&
        <>
        <div className="border border-amber-500 w-[200px] p-2 text-left">{grandtotal._id.month}/{grandtotal._id.year}</div>
        <div className="border border-amber-500 w-[200px] p-2 text-left">GrandTotal:{grandtotal._id.month}/{grandtotal._id.year}</div>
        <div className="border border-amber-500 w-[200px] p-2 text-left">Plan Total</div>
        <div className="border border-amber-500 w-[200px] py-2">{grandtotal?.amount.$numberDecimal}</div>
        <div className="border border-amber-500 w-[100px] p-2 text-left">Difference</div>
        <div className="border border-amber-500 w-[200px] p-2 text-left">Explain Diff</div>
        </>}
        </div>
        
       )):("cant find any totals")
       
       }
       
        </div>
       </>
        
    )
}