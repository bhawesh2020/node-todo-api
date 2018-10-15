//const MongoClient=require('mongodb').MongoClient;
const {MongoClient, ObjectID}=require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp',(err, db)=>{
    if(err)
    {
        return console.log('Unable to connect to database');
    }
    console.log('connected to db');
    
    //deleteMany
    // db.collection('Todos').deleteMany({
    //     task: 'gym'
    // }).then((result)=>{
    //     console.log(result);
    //     //console.log(result.result.n); //prints number of docs deleted
    //     //console.log(result.result.ok) //prints ok status
    // });

    //deleteOne
    // db.collection('Todos').deleteOne({
    //     task: 'gym'
    // }).then((result)=>{
    //     console.log(result);
    //     //console.log(result.result.n); //prints number of docs deleted
    //     //console.log(result.result.ok) //prints ok status
    // });


    //findOneAndDelete
    db.collection('Todos').findOneAndDelete({
        completed:false
    }).then((result)=>{
        console.log(result);
        //console.log(result.result.n); //prints number of docs deleted
        //console.log(result.result.ok) //prints ok status
    });


   // db.close();
}); //url,callback