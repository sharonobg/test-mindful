import NextAuth from "next-auth";
//typescript: import NextAuth, { AuthOptions } from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import CredentialsProvider from 'next-auth/providers/credentials';
//import {MongoDBAdapter} from '@auth/mongodb-adapter'
//import clientPromise from '../../../../libs/clientpromise'
import User from '../../../../models/userModel';
import {signToken} from '../../../../libs/jwt';
import bcrypt from 'bcryptjs';
import connect from '../../../../libs/mongodb';
import {NextResponse} from 'next/server'

export const authOptions = 
    {
        providers:[
            GitHubProvider({
                clientId: process.env.GITHUB_ID ?? "",
                clientSecret: process.env.GITHUB_SECRET ?? "",
              }),
            CredentialsProvider({
                type:'credentials',
                credentials:{
                    username: {label: 'Email', type: 'email',placeholder:'email@example.com'},
                    password:{label: 'Password',type:'password'}
                },
                async authorize(credentials){
                    try{
                        connect();
                        const {email,password} = credentials
                        const user = await User.findOne({email})
                        if(!user){ 
                        
                            throw new Error("Invalid input in authOptions Try")
                    }
                    //2 paramenters:
                    //1 normal password
                    //1 hashed password
                    const comparePass = await bcrypt.compare(password, user.password)
                  
                    if(!comparePass){
                        return NextResponse.json(
                            {
                              error: "Invalid Password",
                            },
                            { status: 400 }
                          );
                    }else{
                        
                        const {password, ...currentUser} = user._doc
                        const accessToken = signToken(currentUser, {expiresIn:'6d'})
                        
                        return{
                            ...currentUser,
                            accessToken
                        }
                    }


                    } catch(err) {
                        throw new Error("Invalid input in authOptions Catch")
                    }
                }
            })
        ],
        debug: true,
        secret: process.env.NEXTAUTH_SECRET,
        //adapter: MongoDBAdapter(clientPromise),
        pages: {
            signIn: '/login'
        },
        callbacks: {
            async jwt({token, user}){
                if(user){
                    token.accessToken = user.accessToken
                    token._id = user._id
                }
                return token
            },
            async session({session, token}){
                if(token){
                    session.user._id = token._id
                    session.user.accessToken = token.accessToken
                }
                return session
            }
        }
    
    }
    
    export const handler = NextAuth(authOptions);
    export {handler as GET, handler as POST};



