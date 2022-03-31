
const express = require('express')

// 获取Model集合
const UserModel = require('../models/UserModel')

const { SUCCESS, FAIL } = require('../config/index')

// 得到路由器对象
const router = express.Router()

// 登录接口
router.post('/login', (req,res) => {
    const {username,password} = req.body
    UserModel.findOne({username,password})
        .then(user => {
            if(user){
                res.send({status:SUCCESS})
            }else{
                res.send({status:FAIL,msg:'账号输入错误或者密码错误'})
            }
        })
})

// 注册接口
router.post('/register', (req,res) => {
    const {username} = req.body
    UserModel.findOne({username})
        .then(user => {
            if(user){
                res.send({status:FAIL,msg:'该用户已经存在'})
            }else{
                UserModel.create(req.body)
                    .then(user =>{
                        res.send({status:SUCCESS,data:user})
                    })
                    .catch(error => {
                        console.log('添加用户异常',error)
                        res.send({status:FAIL,msg:'添加用户异常，请重新尝试'})
                    })
            }
        })
})

// 登录接口
router.get('/', (req,res) => {
    console.log('cccc')
    res.send({status: SUCCESS, data: {b:'b'}})
})

module.exports = router