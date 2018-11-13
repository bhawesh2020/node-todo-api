const expect=require('expect');
const request=require('supertest');
const {ObjectID}=require('mongodb');

const {app}=require('./../server');
const {todo}=require('./../models/todos');
const {user}=require('./../models/user');
const {todos,populateTodos,users,populateUsers}=require('./seed/seed');


beforeEach(populateUsers);
beforeEach(populateTodos);

describe('POST /todos',()=>{
    it('should create new todo',(done)=>{
        var text='new test text';

        request(app)
            .post('/todos')
            .send({text})
            .expect(200)
            .expect((res)=>{
                expect(res.body.text).toBe(text); 
            })
            .end((err,res)=>{
                if(err)
                {
                    return done(err);
                }
                todo.find({text}).then((todos)=>{
                    expect(todos.length).toBe(1);
                    expect(todos[0].text).toBe(text);
                    done();
                }).catch((e)=>{
                    done(e);
                });
        });
    });

    it('should not create todo with invalid data',(done)=>{
        request(app)
            .post('/todos')
            .send({})
            .expect(400)
            .end((err,res)=>{
                if(err)
                {
                    return done(err);
                }
                todo.find().then((todos)=>{
                    expect(todos.length).toBe(2);
                    done();
                }).catch((e)=>done(e));
        });
    });

});


describe('GET /todos',()=>{
    it('should get all todos',(done)=>{
        request(app)
            .get('/todos')
            .expect(200)
            .expect((res)=>{
                expect(res.body.todos.length).toBe(2);
            })
        .end(done);
    });
});


describe('GET /todos/:id',()=>{
    it('should get specified todo doc',(done)=>{
            request(app)
                .get(`/todos/${todos[0]._id.toHexString()}`)
                .expect(200)
                .expect((res)=>{
                    expect(res.body.todo.text).toBe(todos[0].text)
                })
            .end(done);
    });
    it('should return 404 if todo not found',(done)=>{
        var id=new ObjectID().toHexString();
        request(app)
            .get(`/todos/${id}`)
            .expect(404)
        .end(done);
    });
    it('should return 404 for non-object ids',(done)=>{
        request(app)
            .get('/todos/1234')
            .expect(404)
        .end(done);
    });
});

describe('DELETE /todos/:id',()=>{
    it('should remove a todo',(done)=>{
            var hexId=todos[1]._id.toHexString();
            request(app)
                .delete(`/todos/${hexId}`)
                .expect(200)
                .expect((res)=>{
                    expect(res.body.todos._id).toBe(hexId);
                })
            .end((err,res)=>{
                if(err){
                    return done(err);
                }
                todo.findById(hexId).then((todos)=>{
                    expect(todos).toNotExist();
                    done();
                }).catch((e)=>done(e));
            });
    });
    it('should return 404 if todo not found',(done)=>{
        var id=new ObjectID().toHexString();
        request(app)
            .get(`/todos/${id}`)
            .expect(404)
        .end(done);
    });
    it('should return 404 if todo not found',(done)=>{
        request(app)
            .delete('/todos/1234')
            .expect(404)
        .end(done);
    });
});

describe('PATCH /todos/:id',()=>{
    it('should update the todo',(done)=>{
        var hexId=todos[0]._id.toHexString();
        var text="updated text for todo1";
        request(app)
            .patch(`/todos/${hexId}`)
            .send({
                "text":text,
                "completed":true
            })
            .expect(200)
            .expect((res)=>{
                expect(res.body.todo.text).toBe(text);
                expect(res.body.todo.completed).toBe(true);
                expect(res.body.todo.completedAt).toBeA('number');      
            })
        .end((err,res)=>{
            if(err){
                return done(err);
            }
            todo.findById(hexId).then((result)=>{
                expect(result.text).toBe(text);
                expect(result.completed).toBe(true);
                expect(result.completedAt).toBeA('number');
                done();
            }).catch((err)=>{
                done(err);
            });
        });
    });

    it('should clear completedAt when todo is not completed',(done)=>{
        var hexId=todos[1]._id.toHexString();
        var text="updated text for todo2";
        request(app)
            .patch(`/todos/${hexId}`)
            .send({
                "text":text,
                "completed":false
            })
            .expect(200)
            .expect((res)=>{
                expect(res.body.todo.text).toBe(text);
                expect(res.body.todo.completed).toBe(false);
                expect(res.body.todo.completedAt).toNotExist();
            })
        .end((err,res)=>{
            if(err){
                return done(err);
            }
            todo.findById(hexId).then((result)=>{
                expect(result.text).toBe(text);
                expect(result.completed).toBe(false);
                expect(result.completedAt).toNotExist();
                done();
            }).catch((e)=>{
                done(e);
            });
        });
    });
});

describe('GET /users/me',()=>{
    it('should return user if authenticated',(done)=>{
        request(app)
            .get('/users/me')
            .set('x-auth',users[0].tokens[0].token)
            .expect(200)
            .expect((res)=>{
                expect(res.body._id).toBe(users[0]._id.toHexString());
                expect(res.body.email).toBe(users[0].email);
            })
        .end(done);
    });
    it('should return 401 if not authenticated',(done)=>{
        request(app)
            .get('/users/me')
            .expect(401)
            .expect((res)=>{
                expect((res)=>{
                    expect(res.body).toEqual({});
                })
            })
        .end(done);
    });
});

describe('POST /users',()=>{
    it('should create a user',(done)=>{
            var email='bhawesh@qwerty.com';
            var password='123456';
            request(app)
                .post('/users')
                .send({
                    email,
                    password
                })
                .expect(200)
                .expect((res)=>{
                    expect(res.headers['x-auth']).toExist();
                    expect(res.body._id).toExist();
                    expect(res.body.email).toBe(email);
                })
            .end((err)=>{
                if(err){
                    return done(err);
                }
                user.findOne({email}).then((res)=>{
                    expect(res).toExist();
                    expect(res.password).toNotBe(password);
                    done();
                });
            });
    });

    it('should return validation error if request is invalid',(done)=>{
        var email='bhawesh';
        var password='123';
        request(app)
            .post('/users')
            .send({
                email,
                password
            })
            .expect(400)
            .expect((res)=>{
                expect(res.headers['x-auth']).toNotExist();
                expect(res.body._id).toNotExist();
                expect(res.body.email).toNotExist();
            })
        .end(done);
    });

    it('should not create user if email in use',(done)=>{
        request(app)
        .post('/users')
        .send(users[1])
        .expect(400)
        .expect((res)=>{
            expect(res.headers['x-auth']).toNotExist();
            expect(res.body._id).toNotExist();
            expect(res.body.email).toNotExist();
        })
    .end(done);
    });
});