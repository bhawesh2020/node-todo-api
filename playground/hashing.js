const {SHA256}=require('crypto-js');
const jwt=require('jsonwebtoken');
const bcrypt=require('bcryptjs');

var password='qwerty12345';

bcrypt.genSalt(10,(err,salt)=>{
    bcrypt.hash(password,salt,(err,hash)=>{
        console.log(hash);
    });
});

var hashedPass='$2a$10$1fjtoU8GM1NVqj6HiEecVe3HWtNkuO1HVtO8G5pYct0KHne8Tc8he';
bcrypt.compare(password,hashedPass,(err,res)=>{
    console.log(res);
});


// var data={
//     id:5
// };

// var token=jwt.sign(data,'123qwerty');
// console.log(token);
// var decoded=jwt.verify(token,'123qwerty');
// console.log(decoded);

// var msg="Hello world";
// var hash=SHA256(msg).toString();
// console.log(`Hash: ${hash}`);

// var data={
//     id:4
// };
// var token={
//     data,
//     hash:SHA256(JSON.stringify(data)+'secret').toString()
// };
// token.data={
//     id:5
// };
// token.hash=SHA256(JSON.stringify(token.data)).toString();
// var resultHash=SHA256(JSON.stringify(token.data)+'secret').toString();
// if(resultHash===token.hash){
//     console.log('data was not changed');
// }else{
//     console.log('data was changed');
// }