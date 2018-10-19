//const MongoClient=require('mongodb').MongoClient;
const {MongoClient, ObjectID}=require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp',(err, db)=>{
    if(err)
    {
        return console.log('Unable to connect to database');
    }
    console.log('connected to db');

    // db.collection('Todos').findOneAndUpdate({
    //     _id : new ObjectID("5bc4bf2dfb09b16da905478e")
    // },{
    //     $set:{
    //         completed:true
    //     }
    // },{
    //     returnOriginal:false
    // }).then((result)=>{
    //     console.log(result);
    // });


    db.collection('Users').findOneAndUpdate({
        _id: new ObjectID('5bc99c94ff16562168af5306')
    },{
        $set:{
            name:'Bhawesh'
        },
        $inc:{
            age:+1
        }
    },{
        returnOriginal:false
    }).then((result)=>{
        console.log(result);
    });

   // db.close();
}); //url,callback