const mongoose = require('mongoose')
const express = require('express')

const app = express()


// 声明使用静态中间件
app.use(express.static('public'))
// 声明使用解析post请求的中间件
app.use(express.urlencoded({extended: true})) // 请求体参数是：name=tom&pwd=123
app.use(express.json({limit:"5000kb"})) // 请求体参数是json结构：{name: tom, pwd: 123}


// 注意顺序，挂载路由一定在解析请求后，否则读取不到请求体
const indexRouter = require('./routers')
app.use('/', indexRouter)


mongoose.connect('mongodb://localhost/eduction_system',{useNewUrlParser: true})
    .then(()=>{
        console.log('连接数据库成功！')
        app.listen('9090',()=>{
            console.log('网站服务器已经建立，请访问http://localhost:9090')
        })
    })
    .catch(err=>{
        console.error('连接数据库失败',err)
    })