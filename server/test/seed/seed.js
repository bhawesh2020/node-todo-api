const {ObjectID}=require('mongodb');
const jwt=require('jsonwebtoken');

const {todo}=require('./../../models/todos');
const {user}=require('./../../models/user');

const u1id=new ObjectID();
const u2id=new ObjectID();

const users=[{
    _id:u1id,
    email:'abc@xyz.com',
    password:'abcpassword',
    tokens:[
        {
            access:'auth',
            token:jwt.sign({
                _id:u1id,
                access:'auth'
            },process.env.JWT_SECRET).toString()
        }
    ]
},{
    _id:u2id,
    email:'xyz@xyz.com',
    password:'xyzpassword',
    tokens:[
        {
            access:'auth',
            token:jwt.sign({
                _id:u2id,
                access:'auth'
            },process.env.JWT_SECRET).toString()
        }
    ]
}];

const todos=[{
    _id:new ObjectID(),
    text:'test todo 1',
    _creator:u1id
},{
    _id:new ObjectID(),
    text:'test todo 2',
    completed:true,
    completedAt:333,
    _creator:u2id
}];

const populateTodos=(done)=>{
    todo.remove({}).then(()=>{
        return todo.insertMany(todos);
    }).then(()=>done());
};

const populateUsers=(done)=>{
    user.remove({}).then(()=>{
        var u1=new user(users[0]).save();
        var u2=new user(users[1]).save();

        return Promise.all([u1,u2]);
    }).then(()=>done());
};

module.exports={
    todos,
    populateTodos,
    populateUsers,
    users
};