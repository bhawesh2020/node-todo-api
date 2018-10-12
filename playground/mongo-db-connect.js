//const MongoClient=require('mongodb').MongoClient;
const {MongoClient, ObjectID}=require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp',(err, db)=>{
    if(err)
    {
        return console.log('Unable to connect to database');
    }
    console.log('connected to db');
    // db.collection('Todos').insertOne({
    //     name:'Bhawesh',
    //     age: 22
    // },(err, result)=>{
    //     if(err)
    //     {
    //         return console.log('Unable to insert todo',err);
    //     }
    //     console.log(JSON.stringify(result.ops,undefined,3));
    // });

    // db.collection('Users').insertOne({
    //     name:'John',
    //     age:20,
    //     location:'Bangalore'
    // },(err,result)=>{
    //     if(err)
    //     {
    //         return console.log('Unable to insert user',err);
    //     }
    //     console.log(JSON.stringify(result.ops[0]._id.getTimestamp(),undefined,5))
    // });


    db.close();
}); //url,callback