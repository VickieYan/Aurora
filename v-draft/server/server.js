 const express = require('express')
 const mongoose = require('mongoose')
 //链接mongo,并且使用vickie这个集合
 const DB_URL = 'mongodb://127.0.0.1:27017/vickie'
 mongoose.connect(DB_URL)
 mongoose.connection.on('connected',function() {
     console.log('mongo connect success')
 })
 const User = mongoose.model('user',new mongoose.Schema({
    name: {type: String, require: true},
    age: {type: number, require: true}
 }))
//  User.create({
//      name:'imooc',
//      age:18
//  }, function(err, doc) {
//     if(!err) {
//         console.log(doc)
//     }else {
//         console.log(err)
//     }
//  })
 //新建app
 const app = express()

 app.get('/',function(req,res) {
     res.send('<h1>hello</h1>')
 })

 app.get('/data',function(req,res) {
     User.find({},function(req,res) {
         res.json(doc)
     })
 })

 app.listen(9093,function(){
     console.log('node app start at port 9093')
 })
