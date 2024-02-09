export{default} from 'next-auth/middleware'

export const config = {matcher:[
    "/transaction/:path*",
    "/addCategory",  
    "/api/:path*",
    "/my-spending-plan", 
]
}