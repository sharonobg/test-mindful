import {MongoClient}from 'mongodb';
const URI = process.env.NEXT_PUBLIC_MONGODB_URI;
const options = {}
if(!URI) throw new Error('Please add Mongo URI');
let client = new MongoClient(URI,options)
let clientPromise
if(process.env.NODE.ENV !== 'production'){
    console.log('NOT production env')
    if(!global._mongoClientPromise){
        console.log('no promise so create on')
        global._mongoClientPromise = client.connect()
    }
    console.log('promise exists')
    clientPromise = global._mongoClientPromise
}else{
    console.log('production env')
    clientPromise = client.connect()
}