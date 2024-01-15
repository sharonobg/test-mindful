import {getServerSession} from "next-auth";

export default async function LandingPage(){
    const session = await getServerSession();
    console.log(session)
return(<>
    
    <h2>Session Results:</h2>
   {session?.user?._id ? (
      <div>You are logged in as {session?.user?._id}</div>
    ): (<div><h1>Please sign in for your Spending Plan</h1></div>)}
    </>
)

}