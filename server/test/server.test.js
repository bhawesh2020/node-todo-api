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
            .set('x-auth',users[0].tokens[0].token)
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
            .set('x-auth',users[0].tokens[0].token)
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
            .set('x-auth',users[0].tokens[0].token)
            .expect(200)
            .expect((res)=>{
                expect(res.body.todos.length).toBe(1);
            })
        .end(done);
    });
});


describe('GET /todos/:id',()=>{
    it('should get specified todo doc',(done)=>{
            request(app)
                .get(`/todos/${todos[0]._id.toHexString()}`)
                .set('x-auth',users[0].tokens[0].token)
                .expect(200)
                .expect((res)=>{
                    expect(res.body.todo.text).toBe(todos[0].text)
                })
            .end(done);
    });

    it('should not get specified todo doc created by other user',(done)=>{
        request(app)
            .get(`/todos/${todos[1]._id.toHexString()}`)
            .set('x-auth',users[0].tokens[0].token)
            .expect(404)
        .end(done);
});

    it('should return 404 if todo not found',(done)=>{
        var id=new ObjectID().toHexString();
        request(app)
            .get(`/todos/${id}`)
            .set('x-auth',users[0].tokens[0].token)
            .expect(404)
        .end(done);
    });
    it('should return 404 for non-object ids',(done)=>{
        request(app)
            .get('/todos/1234')
            .set('x-auth',users[0].tokens[0].token)
            .expect(404)
        .end(done);
    });
});

describe('DELETE /todos/:id',()=>{
    it('should remove a todo',(done)=>{
            var hexId=todos[1]._id.toHexString();
            request(app)
                .delete(`/todos/${hexId}`)
                .set('x-auth',users[1].tokens[0].token)
                .expect(200)
                .expect((res)=>{
                    expect(res.body.todos._id).toBe(hexId);
                })
            .end((err,res)=>{
                if(err){
                    return done(err);
                }
                todo.findById(hexId).then((todos)=>{
                    expect(todos).toBeFalsy();
                    done();
                }).catch((e)=>done(e));
            });
    });

    it('should not remove a todo created by another user',(done)=>{
        var hexId=todos[1]._id.toHexString();
        request(app)
            .delete(`/todos/${hexId}`)
            .set('x-auth',users[0].tokens[0].token)
            .expect(404)
        .end((err,res)=>{
            if(err){
                return done(err);
            }
            todo.findById(hexId).then((todos)=>{
                expect(todos).toBeTruthy();
                done();
            }).catch((e)=>done(e));
        });
    });

    it('should return 404 if todo not found',(done)=>{
        var id=new ObjectID().toHexString();
        request(app)
            .get(`/todos/${id}`)
            .set('x-auth',users[1].tokens[0].token)
            .expect(404)
        .end(done);
    });
    it('should return 404 if todo not found',(done)=>{
        request(app)
            .delete('/todos/1234')
            .set('x-auth',users[1].tokens[0].token)
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
            .set('x-auth',users[0].tokens[0].token)
            .send({
                "text":text,
                "completed":true
            })
            .expect(200)
            .expect((res)=>{
                expect(res.body.todo.text).toBe(text);
                expect(res.body.todo.completed).toBe(true);
                // expect(res.body.todo.completedAt).toBeA('number');      
                expect(typeof res.body.todo.completedAt).toBe('number');
            })
        .end((err,res)=>{
            if(err){
                return done(err);
            }
            todo.findById(hexId).then((result)=>{
                expect(result.text).toBe(text);
                expect(result.completed).toBe(true);
                expect(typeof result.completedAt).toBe('number');
                done();
            }).catch((err)=>{
                done(err);
            });
        });
    });

    it('should not update the todo created by another user',(done)=>{
        var hexId=todos[0]._id.toHexString();
        var text="updated text for todo1";
        request(app)
            .patch(`/todos/${hexId}`)
            .set('x-auth',users[1].tokens[0].token)
            .send({
                "text":text,
                "completed":true
            })
            .expect(404)
        .end((err,res)=>{
            if(err){
                return done(err);
            }
            todo.findById(hexId).then((result)=>{
                expect(result.text).not.toBe(text);
                expect(result.completed).not.toBe(true);
                expect(typeof result.completedAt).not.toBe('number');
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
            .set('x-auth',users[1].tokens[0].token)
            .send({
                "text":text,
                "completed":false
            })
            .expect(200)
            .expect((res)=>{
                expect(res.body.todo.text).toBe(text);
                expect(res.body.todo.completed).toBe(false);
                expect(res.body.todo.completedAt).toBeFalsy();
            })
        .end((err,res)=>{
            if(err){
                return done(err);
            }
            todo.findById(hexId).then((result)=>{
                expect(result.text).toBe(text);
                expect(result.completed).toBe(false);
                expect(result.completedAt).toBeFalsy();
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
                    expect(res.headers['x-auth']).toBeTruthy();
                    expect(res.body._id).toBeTruthy();
                    expect(res.body.email).toBe(email);
                })
            .end((err)=>{
                if(err){
                    return done(err);
                }
                user.findOne({email}).then((res)=>{
                    expect(res).toBeTruthy();
                    expect(res.password).not.toBe(password);
                    done();
                }).catch((e)=>done(e));
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
                expect(res.headers['x-auth']).toBeFalsy();
                expect(res.body._id).toBeFalsy();
                expect(res.body.email).toBeFalsy();
            })
        .end(done);
    });

    it('should not create user if email in use',(done)=>{
        request(app)
        .post('/users')
        .send(users[1])
        .expect(400)
        .expect((res)=>{
            expect(res.headers['x-auth']).toBeFalsy();
            expect(res.body._id).toBeFalsy();
            expect(res.body.email).toBeFalsy();
        })
    .end(done);
    });
});

describe('POST /users/login',()=>{
    it('should login user and return auth token',(done)=>{
        request(app)
            .post('/users/login')
            .send({
                email:users[1].email,
                password:users[1].password
            })
            .expect(200)
            .expect((res)=>{
                expect(res.headers['x-auth']).toBeTruthy();
                expect(res.body._id).toBe(users[1]._id.toHexString());
                expect(res.body.email).toBe(users[1].email);
            })
        .end((err,res)=>{
            if(err)
            {
                return done(err);
            }
            user.findById(users[1]._id).then((result)=>{
                expect(result.toObject().tokens[1]).toMatchObject({
                    access:'auth',
                    token:res.headers['x-auth']
                });
                done();
            }).catch((e)=>done(e));
        });
    });
    it('should reject invalid login',(done)=>{
        request(app)
            .post('/users/login')
            .send({
                email:'fasjdf@qwery.email',
                password:'password'
            })
            .expect(400)
            .expect((res)=>{
                expect(res.headers['x-auth']).toBeFalsy();
            })
        .end((err,res)=>{
            if(err)
            {
                return done(err);
            }
            user.findById(users[1]._id).then((result)=>{
                expect(result.tokens.length).toBe(1);
                done();
            }).catch((e)=>done(e));
        });
    });
});

describe('DELETE /users/me/token',()=>{
    it('should remove auth token on logout',(done)=>{
        request(app)
            .delete('/users/me/token')
            .set('x-auth',users[0].tokens[0].token)
            .expect(200)
        .end((err,res)=>{
            if(err)
            {
                return done(err);
            }
            user.findById(users[0]._id).then((result)=>{
                expect(result.tokens.length).toBe(0);
                done();
            }).catch((e)=>done(e));
        });
    });
    
});