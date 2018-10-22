var {mongoose}=require('./db/mongoose.js');
var {todo}=require('./models/todos.js');
var {user}=require('./models/user.js');

// var newTodo= new Todo({
//     text: 'Play'
// });

// newTodo.save().then((doc)=>{
//     console.log(doc);
// },(e)=>{
//     console.log(e);
// });



var newUser= new user({
    email:"bhawesh2020@example.com"
});
newUser.save().then((docs)=>{
    console.log('User added',docs);
},(err)=>{
    console.log('Some error occured',err);
});