var express=require('express');
var bodyParser=require('body-parser');

const {ObjectID}=require('mongodb');

var {mongoose}=require('./db/mongoose.js');
var {todo}=require('./models/todos.js');
var {user}=require('./models/user.js');

var app=express();
var port=process.env.PORT || 3000;

app.use(bodyParser.json());

app.post('/todos',(req,res)=>{
    console.log(req.body);
    var newTodo=new todo({
        text: req.body.text
    });

    newTodo.save().then((doc)=>{
        res.send(doc);
    },(err)=>{
        res.status(400).send(err);
    });

});

app.get('/todos',(req,res)=>{
    todo.find().then((todos)=>{
        res.send({todos});
    },(err)=>{
        res.status(400).send(err);
    });
});

app.get('/todos/:id',(req,res)=>{
    var id=req.params.id;
    if(!ObjectID.isValid(id))
    {
        return res.status(404).send();
    }
    todo.findById(id).then((todo)=>{
        if(!todo)
            return res.status(404).send();
        res.send({todo});
        }).catch((e)=>{
            res.status(400).send();
            console.log(e);
        });
});

app.delete('/todos/:id',(req,res)=>{
    var id=req.params.id;
    if(!ObjectID.isValid(id))
    {
        return res.status(404).send();
    }
    todo.findByIdAndRemove(id).then((todos)=>{
        if(!todos)
            return res.status(404).send();
        res.send({todos});
    }).catch((e)=>{
        res.status(400).send();
    });
});

module.exports={app};

app.listen(port,()=>{
    console.log(`Started on port ${port}`);
});