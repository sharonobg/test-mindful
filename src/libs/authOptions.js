import CredentialsProvider from 'next-auth/providers/credentials';
import User from '@/models/userModel';
import {signToken,} from '@/libs/jwt';
import bcrypt from 'bcryptjs';

const authOptions = {
    secret: process.env.NEXTAUTH_SECRET,
    providers:[
        CredentialsProvider({
            type:'credentials',
            credentials:{
                username: {label: 'Email', type: 'email',placeholder:'email@example.com'},
                password:{label: 'Password',type:'password'}
            },
            async authorize(credentials,req){
                
                const {email,password} = credentials
                await connect();
                const user = await User.findOne({email})
                
                if(!user){ throw new Error("Invalid input")}
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
            }
        })
    ],
    secret: process.env.NEXTAUTH_SECRET,
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
                //session.user.id = token.id;
                //session.user.name = token.name;
                //session.user.email = token.email;
                //session.user.image = token.picture;
                session.user._id = token.id
                session.user.accessToken = token.accessToken
            }
            
            return session
        }
    }

}
export default authOptions