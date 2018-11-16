require('./config/config');

const _=require('lodash');
const express=require('express');
const bodyParser=require('body-parser');

const {ObjectID}=require('mongodb');

var {mongoose}=require('./db/mongoose.js');
var {todo}=require('./models/todos.js');
var {user}=require('./models/user.js');
var {authenticate}=require('./middleware/authenticate');

var app=express();
var port=process.env.PORT;

app.use(bodyParser.json());

app.post('/todos',authenticate,(req,res)=>{
    console.log(req.body);
    var newTodo=new todo({
        text: req.body.text,
        _creator:req.user._id
    });

    newTodo.save().then((doc)=>{
        res.send(doc);
    },(err)=>{
        res.status(400).send(err);
    });

});

app.get('/todos',authenticate,(req,res)=>{
    todo.find({
        _creator:req.user._id
    }).then((todos)=>{
        res.send({todos});
    },(err)=>{
        res.status(400).send(err);
    });
});

app.get('/todos/:id',authenticate,(req,res)=>{
    var id=req.params.id;
    if(!ObjectID.isValid(id))
    {
        return res.status(404).send();
    }
    todo.findOne({
        _id:id,
        _creator:req.user.id
    }).then((todo)=>{
        if(!todo)
            return res.status(404).send();
        res.send({todo});
        }).catch((e)=>{
            res.status(400).send();
            console.log(e);
        });
});

app.delete('/todos/:id',authenticate,(req,res)=>{
    var id=req.params.id;
    if(!ObjectID.isValid(id))
    {
        return res.status(404).send();
    }
    todo.findOneAndRemove({
        _id:id,
        _creator:req.user._id
    }).then((todos)=>{
        if(!todos)
            return res.status(404).send();
        res.send({todos});
    }).catch((e)=>{
        res.status(400).send();
    });
});

app.patch('/todos/:id',authenticate,(req,res)=>{
    var id=req.params.id;
    var body=_.pick(req.body,['text','completed']);
    var id=req.params.id;
    if(!ObjectID.isValid(id))
    {
        return res.status(404).send();
    }
    if(_.isBoolean(body.completed) && body.completed){
        body.completedAt=new Date().getTime();    
    }else{
        body.completed=false;
        body.completedAt=null;
    }

    todo.findOneAndUpdate({
        _id:id,
        _creator:req.user.id
    },{$set:body},{new:true}).then((todo)=>{
        if(!todo){
            return res.status(404).send();
        }

        res.send({todo});
    }).catch((e)=>{
        res.status(400).send();
    });

});

app.post('/users',(req,res)=>{
    var body=_.pick(req.body,['email','password']);
    var newUser=new user(body);

    newUser.save().then(()=>{
        return newUser.generateAuthToken();   
    }).then((token)=>{
        res.header('x-auth',token).send(newUser);
    })
    .catch((e)=>{
        res.status(400).send(e);
    });
});

app.post('/users/login',(req,res)=>{
    var body=_.pick(req.body,['email','password']);
    
    user.findByCredentials(body.email,body.password).then((result)=>{
        return result.generateAuthToken().then((token)=>{
            res.header('x-auth',token).send(result);
        });
        
    }).catch((e)=>{
        res.status(400).send();
    });
});



app.get('/users/me',authenticate,(req,res)=>{
    res.send(req.user);
});

app.delete('/users/me/token',authenticate,(req,res)=>{
    req.user.removeToken(req.token).then(()=>{
        res.status(200).send();
    },()=>{
        res.status(400).send();
    });
});

module.exports={app};

app.listen(port,()=>{
    console.log(`Started on port ${port}`);
});