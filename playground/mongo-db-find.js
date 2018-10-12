//const MongoClient=require('mongodb').MongoClient;
const {MongoClient, ObjectID}=require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp',(err, db)=>{
    if(err)
    {
        return console.log('Unable to connect to database');
    }
    console.log('connected to db');
    // db.collection('Todos').find({
    //     _id:new ObjectID('5baa041f2f9efa2150fa371c')
    // }).toArray().then((docs)=>{
    //     console.log(JSON.stringify(docs,undefined,3));
    // }).catch((error)=>{
    //     console.log(error);
    // });

    // db.collection('Todos').find().count().then((count)=>{
    //     console.log(count);
    // }).catch((error)=>{
    //     console.log(error);
    // });

    db.collection('Users').find({
        name:"Bhawesh"
    }).toArray().then((docs)=>{
        console.log(JSON.stringify(docs))
    });

    db.collection('Users').find({
        name:"Bhawesh"
    }).count().then((count)=>{
        console.log(count);
    });

    

    // db.collection('Todos').find({
    //     _id:new ObjectID('5baa041f2f9efa2150fa371c')
    // }).forEach((res)=>{
    //     console.log(res);
    // });

   // db.close();
}); //url,callback