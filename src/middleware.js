export{default} from 'next-auth/middleware'

export const config = {matcher:[
    "/transaction/:path*",
    "/addCategory",
    
]
}