import jwt from 'jsonwebtoken';

//signing jwt
export function signToken(payload, options = {}){
    const secret = process.env.NEXTAUTH_SECRET;
    const token = jwt.sign(payload, secret, options);
    //console.log('jwt signing token',token)
    return token;
}
// verify token
export function verifyToken(token){
    try{
        const secret = process.env.NEXTAUTH_SECRET;
        const payload = jwt.verify(token, secret);
        return payload;
    }catch (error){
        console.error(error);
        return null;
    }
}

