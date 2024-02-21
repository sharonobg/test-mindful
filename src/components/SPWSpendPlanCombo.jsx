import {headers} from "next/headers"

const getPlans = async (props) => {
    try{
        const res = await fetch("http://localhost:3000/api/spending-plan-alt",{
           cache: 'no-store',
           method: "GET",
           headers: headers(),
        });
        if(!res.ok){
            throw new Error("Failed to fetch plan");
        }
        //const data = await res.json();
        //console.log('data',data);
        return res.json();
        //return data
    }catch(error){
        console.log("Error finding plan",error)

    }
    
}
const getTotals = async () => {
    try{
        const res = await fetch("http://localhost:3000/api/combo-waddfields-ttitles",{
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
    //const {categories} = await getCategories();
    const transactiontotals = await getTotals();
    //const spendingplannew = await getPlans();
    //const  getboth = await  getBothWTotals();
    //const spendingplannotalt = await getPlansFirst(); 
    //const grandtotals = await getGrandTotals();
    const getplans = await getPlans();
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
//const mycategoriesdata = getPlans();

    //console.log('getPlans',getplans)
    //console.log('spending planfiltermonth',props.fmonth)
    //console.log('spending planfilteryear',props.fyear)
   //console.log('SPCategoryView transactiontotals',transactiontotals)
   //console.log(`${getplans.month}/{ getplans.year}`)
    return(
       <>
         {/*} <pre>GET getplans:{JSON.stringify(getplans, null, 2)}</pre>*/}

       <div className="my-5 flex flex-col place-items-center">
       <h1>SPW Spending Plan Combo:  {props.fmonth}/{props.fyear}<br />(note-cats not entered should be 0.00 all categories should show)</h1>
       </div>
       <div className="my-5 flex flex-col place-items-center">
       <div className="flex flex-row  w-full min-h-[50%] bg-white">
        <div className="font-bold border border-amber-500 w-[200px] p-2 ">Category Notes</div>
        <div className="font-bold border border-amber-500 w-[200px] p-2 ">Category</div>
        <div className="font-bold border border-amber-500 w-[200px] p-2 ">Planned Amount</div>
        <div className="font-bold border border-amber-500 w-[200px] py-2">Actual Amount</div>
        <div className="font-bold border border-amber-500 w-[100px] p-2 ">Difference</div>
        <div className="font-bold border border-amber-500 w-[200px] p-2 ">Explain Diff</div>
        </div>
        {getplans?.length > -1 ? (getplans.map((spendingplan,index) =>
           
        <div key={index} className="spkey">
        { spendingplan?.month == `${props?.fmonth}` && spendingplan?.year == `${props?.fyear}` ?  (
                    <>
        <div className="flex flex-col" key={spendingplan._id}>
                    
        {spendingplan.mycategories.map((lookup,index) =>
            
            <div className="flex flex-row" key={index}>
            <div className="border border-amber-500 w-[200px] p-2 ">{spendingplan.$amount}</div>
                     <div className="border border-amber-500 w-[200px] p-2 ">{spendingplan.$title}</div>
            <div className="border border-amber-500 w-[200px] p-2 ">{spendingplan.month}/{spendingplan.year}</div>
            <div className="border border-amber-500 w-[400px] p-2 ">Category:{lookup.$mycategoryId}{lookup.categorynotes}</div>
            
           
            <div className="border border-amber-500 w-[200px] p-2 ">planamt:{lookup.planamount.$numberDecimal}</div>
            
            </div>
            )}
            </div></> 
        ): `SPW You don't have a plan set up for ${props.fmonth}/${props.fyear}`}
        </div>
        
        )):("cant find plan")
        }
       {transactiontotals?.length > -1 ? (transactiontotals.map( (transactiontotal,index) =>
        <div key={index} className="transactiontotalkey">
        { transactiontotal._id.year == `${props.fyear}` && transactiontotal._id.month == `${props.fmonth}` && (`${props.category}` == 'all-categories' ||  transactiontotal._id.title == `${props.category}`) && 
        <>
        <div className="title border border-amber-500 w-[200px] p-2 ">{transactiontotal?._id.title}</div>
        <div className="amount border border-amber-500 w-[200px] py-2">{transactiontotal?.amount.$numberDecimal}</div>
        <div className="diff border border-amber-500 w-[100px] p-2 ">Difference</div>
        <div className="explain border border-amber-500 w-[200px] p-2 ">Explain Diff</div>
        </>  }
        </div>
   
       )):("cant find any totals")
       
       }
     
       {/*
       {grandtotals?.length > -1 ? (grandtotals.map((grandtotal,index) =>
        
        <div key={index} className="flex flex-row  w-full min-h-[50%] font-bold bg-white">
        {  grandtotal._id.year == `${props.fyear}` && grandtotal._id.month == `${props.fmonth}` && `${props.category}` == 'all-categories' &&
        <>
        <div className="border border-amber-500 w-[200px] p-2 ">{grandtotal._id.month}/{grandtotal._id.year}</div>
        <div className="border border-amber-500 w-[200px] p-2 ">GrandTotal:{grandtotal._id.month}/{grandtotal._id.year}</div>
        <div className="border border-amber-500 w-[200px] p-2 ">Plan Total</div>
        <div className="border border-amber-500 w-[200px] py-2">{grandtotal?.amount.$numberDecimal}</div>
        <div className="border border-amber-500 w-[100px] p-2 ">Difference</div>
        <div className="border border-amber-500 w-[200px] p-2 ">Explain Diff</div>
        </>}
        </div>
        
       )):("cant find any totals")
       
       }*/}
       
        </div>
       </>
        
    )
}