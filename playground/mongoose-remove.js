const {ObjectID}=require('mongodb');

const {mongoose}=require('./../server/db/mongoose');
const {todo}=require('./../server/models/todos');
const {user}=require('./../server/models/user');

// todo.remove({}).then((res)=>{
//     console.log(res);
// });

//todo.findOneAndRemove()
//todo.findByIdAndRemove()

// todo.findByIdAndRemove('5be72f5a5c1076b5ca37b5f9').then((doc)=>{
//     console.log(doc);
// });

todo.findOneAndRemove({
        _id:'5be72f5a5c1076b5ca37b5f9'
    }).then((doc)=>{
    console.log(doc);
});