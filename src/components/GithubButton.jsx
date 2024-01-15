"use client"
import { useSearchParams } from 'next/navigation'
import { signIn } from 'next-auth/react'

export default function GithubButton() {
    const searchParams = useSearchParams()
    const callbackUrl = searchParams.get('callbackUrl')
    return(

        <button
          className='border border-amber-500 bg-amber-400 text-gray-500 font-bold flex'
          onClick={() => signIn('github', { callbackUrl })}
        >Log in with Github</button>
    )


}
