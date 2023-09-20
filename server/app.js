const express = require('express')
const cors = require('cors')
const app = express()
var bodyParser = require('body-parser')
var jsonParser = bodyParser.json()
const bcrypt = require('bcrypt');
const saltRounds = 10
var jwt = require('jsonwebtoken');
const secret = 'fullstack'

app.use(cors())

const mysql = require('mysql2');
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '12345678',
    database: 'project'
  });

app.post('/register', jsonParser, function (req, res, next) {

    if (!req.body.email.endsWith('@gmail.com')) {
        return res.json({ status: 'error', message: 'รูปแบบอีเมลไม่ถูกต้อง' });
    }
    bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
        const role = req.body.role || 'user';
        connection.execute(
            'INSERT INTO users (email, password, fname, lname, role) VALUES (?, ?, ?, ?, ?)',
            [req.body.email, hash, req.body.fname, req.body.lname, role],
            function(err, results, fields) {
             if(err){
                res.json({status: 'error', message: err})
                return
             }
               res.json({status: 'ok'})
            }
          );
    });
})

app.post('/login', jsonParser, function (req, res, next) {
    connection.execute(
        'SELECT * FROM users WHERE email=?',
        [req.body.email],
        function(err, users, fields) {
         if (err) { res.json({status: 'error', message: err}); return }
         if (users.length == 0) { res.json({status: 'error', message: 'no user found'}); return }
        bcrypt.compare(req.body.password, users[0].password, function(err, isLogin) {
            if (isLogin) {
                var token = jwt.sign({ email: users[0].email, role: users[0].role }, secret, {expiresIn: '1h'} );
                res.json({status: 'ok', message: 'login success',token, role: users[0].role})
            }else {
                res.json({status: 'error', message: 'login failed'})
            }
        });
  
        }
    );
})
app.post('/authen', jsonParser, function (req, res, next){
    try{
      const token = req.headers.authorization.split(' ')[1]
   const decoded = jwt.verify(token, secret);
   res.json({status: 'ok',decoded})  

    }catch(err) {
        res.json({status: 'error', message: err.message})
    }
   
})

app.listen(3333, function () {
  console.log('work on 3333')
})