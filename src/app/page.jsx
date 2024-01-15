
import connect from '../libs/mongodb'
import Link from 'next/link';
import TransactionsListId from '../components/TransactionsListId';
//import TransactionsListIdClient from '../components/TransactionsListIdClient';
import Filters from '../components/Filters';
import SpendingPlan from '../components/SpendingPlan';
import {getServerSession} from "next-auth";

export default async function Home({searchParams}) {
  
  await connect()
  const session = await getServerSession();
  //filter - default is current month but can select from a dropdown of all months

  //let query = filters;
const getMonth = new Date()
const month = getMonth.toLocaleString('default', { month: 'long' });
console.log('home props',searchParams)
const newsearchParams = new URLSearchParams({searchParams});
    //const catsearchParams = new URLSearchParams('category');
console.log('home newsearchParams',newsearchParams)

for (const [key, value] of newsearchParams.entries()) {
  const nkey={key};
  const nvalue={value}
  //console.log('home params: ',`${key}, ${value}`);
  console.log('home params: ',nkey, nvalue);
  
}



  return (
    <>
   
    <main className="flex flex-col place-content-center text-center py-5">
    
    {session?.user?.email ? 
    (
      <>
      <h1>Month:{searchParams.fmonth}  Category: {searchParams.category}</h1>
      <SpendingPlan fmonth={searchParams.fmonth} category={searchParams.category} />
      <TransactionsListId fmonth={searchParams.fmonth} category={searchParams.category}/>
      </>
      ):(
        <Link href="/login">
        <h1>Please log in to see your Spending Plan</h1>
        </Link>
      )
      }
    </main>
    </>
  )
}
