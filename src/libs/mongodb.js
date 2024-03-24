import mongoose from "mongoose";
//replacing with cache
//export const connect = async () => {
//    try{
//        await mongoose.connect(process.env.MONGODB_URI);
//        console.log("connected to Mongo");
//
//    } catch (error) {
//        console.log("no connection to Mongo",error);
//    }
//};
const MONGODB_URI = process.env.MONGODB_URI;
if(!MONGODB_URI){throw new Error('Please define a MONGODB_URI')}
let cached = global.mongoose;
if(!cached){
    console.log('no global cached')
    cached = global.mongoose = {conn: null, promise: null};
}
async function connect() {
    if(cached.conn){ 
        console.log('cashed conn exists')
        return cached.conn;}
    if(!cached.promise){ 
        console.log('no mongo promise')
        const opts = {bufferCommands: false,};
        cached.promise = mongoose.connect(MONGODB_URI,opts).then((mongoose) =>{
            return mongoose
        });
    }
    console.log('set cached promise for connect')
    cached.conn = await cached.promise;
    return cached.conn;
}
export default connect;