import {MongoClient}from 'mongodb';
const URI = process.env.NEXT_PUBLIC_MONGODB_URI;
const options = {}
if(!URI) throw new Error('Please add Mongo URI');
let client = new MongoClient(URI,options)
let clientPromise
if(process.env.NODE.ENV !== 'production'){
    if(!global._mongoClientPromise){
        global._mongoClientPromise = client.connect()
    }
    clientPromise = global._mongoClientPromise
}else{
    clientPromise = client.connect()
}