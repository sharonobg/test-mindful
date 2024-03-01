import {NextRequest, NextResponse} from "next/server";


    const allowedOrigins = [
        'http://localhost:3000/',
        'https://mindful-spending-22924.vercel.app/',
        'https://mindful-spending.vercel.app/',
    ]
    const corsOptions = {
        'Access-Control-Allow-Headers':
        'Content-Type, Authorization, X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Date, X-Api-Version',
        'Access-Control-Allow-Credentials': "true",
        'Access-Control-Allow-Methods': 'GET,DELETE,PATCH,POST,PUT',
    }
    export function middleware(request){
        // Check the origin from the request
      const origin = request.headers.get('origin') ?? ''
      const isAllowedOrigin = allowedOrigins.includes(origin)
      // Handle preflighted requests
      const isPreflight = request.method === 'OPTIONS'
      if (isPreflight) {
        const preflightHeaders = {
          ...(isAllowedOrigin && { 'Access-Control-Allow-Origin': origin }),
          ...corsOptions,
        }

        return NextResponse.json({}, { headers: preflightHeaders })
  }
    //simple requests
    const response = NextResponse.next()
  if (isAllowedOrigin) {
    response.headers.set('Access-Control-Allow-Origin', origin)
  }
  Object.entries(corsOptions).forEach(([key, value]) => {
    response.headers.set(key, value)
  })

    console.log('origin',origin)
    return response
}

//export{default} from 'next-auth/middleware'
export const config = {
    matcher:[
    "/transaction/:path*",
    "/addCategory",  
    "/api/:path*",
    "/my-spending-plan", 
]
}