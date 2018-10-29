const {ObjectID}=require('mongodb');

const {mongoose}=require('./../server/db/mongoose');
const {todo}=require('./../server/models/todos');
const {user}=require('./../server/models/user');

var id='5bcede72cf66e8fc1db02506';
var uid='5bcc8dcc541426241b70ee92';

// if(!ObjectID.isValid(id))
// {
//     console.log('id invalid');
// }

if(!ObjectID.isValid(uid))
{
    console.log('id invalid');
}

// todo.find({
//     _id:id
// }).then((todos)=>{
//     if(todos.length==0)
//         return console.log("No doc found");
//     console.log(todos);
// });

// todo.findOne({
//     _id:id
// }).then((res)=>{
//     if(!res)
//         return console.log("No doc found");
//     console.log(res);
// });

// todo.findById(id).then((res)=>{
//     if(!res)
//         return console.log("No doc found");
//     console.log('by id:',res);
// }).catch((e)=>{
//     console.log(e);
// });

user.findById(uid).then((res)=>{
    if(!res)
        return console.log('User not found');
    console.log(res);
}).catch((e)=>{
    console.log(e);
});