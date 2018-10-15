//const MongoClient=require('mongodb').MongoClient;
const {MongoClient, ObjectID}=require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp',(err, db)=>{
    if(err)
    {
        return console.log('Unable to connect to database');
    }
    console.log('connected to db');
    
    // db.collection('Users').deleteMany({
    //     name:'Bhawesh'
    // }).then((result)=>{
    //     console.log(result);
    // });


    db.collection('Users').findOneAndDelete({
        _id:new ObjectID('5bbf67bc7cd40784ebdd1832')
    }).then((result)=>{
        console.log(result);
    });

   // db.close();
}); //url,callback