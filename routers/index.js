
const express = require('express')

// 获取Model集合
const UserModel = require('../models/UserModel')
const CourseModel = require('../models/CourseModel')
const ClassModel = require('../models/ClassModel')
const TimetableModel = require('../models/TimetableModel')

const { SUCCESS, FAIL } = require('../config/index')

// 得到路由器对象
const router = express.Router()

// 登录接口
router.post('/login', (req,res) => {
    const {username,password} = req.body
    UserModel.findOne({username,password})
        .then(user => {
            if(user){
                res.send({status:SUCCESS, data: user})
            }else{
                res.send({status:FAIL,msg:'账号输入错误或者密码错误'})
            }
        })
})
// 注册接口
router.post('/register', (req,res) => {
    const { username } = req.body
    UserModel.findOne({ username })
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
// 获取用户列表
router.post('/user-list', (req,res) => {
    const { username, phone, gender, role, disabled } = req.body
    let search = {}
    if (phone){
        search.phone = phone
    }
    if (gender){
        search.gender = gender
    }
    if (role){
        search.role = role
    }
    if (disabled === false || disabled === true){
        search.disabled = disabled
    }
    let data = []
    UserModel.find({ ...search })
        .then(users => {
            data = users
            if (username){
                UserModel.find({ "username": { $regex:username } })
                    .then(users2 => {
                        let temp = []
                        for(let i = 0 ; i < data.length ; i++){
                            temp.push(data[i].username)
                        }
                        let array = users2.filter(node => temp.indexOf(node.username) > -1)
                        res.send({ status: SUCCESS, data: array})
                    })
            } else {
                res.send({ status: SUCCESS, data: data})
            }
        })
})
// 获取学生列表
router.get('/student-list', (req,res) => {
    UserModel.find({ role: 'student' })
        .then(users => {
            let data = []
            users.map(user => {
                data.push({
                    value: user._id,
                    label: user.username,
                })
            })
            res.send({ status: SUCCESS, data })
        })
        .catch(error => {
            console.log(error)
            res.send({ status: FAIL, msg: '获取学生列表失败'})
        })
})
// 获取教师列表
router.get('/teacher-list', (req,res) => {
    UserModel.find({ role: 'teacher' })
        .then(users => {
            let data = []
            users.map(user => {
                data.push({
                    value: user._id,
                    label: user.username,
                })
            })
            res.send({ status: SUCCESS, data })
        })
        .catch(error => {
            console.log(error)
            res.send({ status: FAIL, msg: '获取教师列表失败'})
        })
})
// 更新用户
router.post('/user-update', (req, res) => {
    const { _id, username } = req.body
    UserModel.findOne({ username })
        .then(user => {
            if (user && user.username !== username) {
                res.send({ status: FAIL, msg: '已存在该用户名'})
            } else {
                UserModel.findOneAndUpdate({ _id }, req.body)
                    .then(user => {
                        res.send({ status: SUCCESS, data: user})
                    })
                    .catch(error => {
                        console.log(error)
                        res.send({ status: FAIL, msg: '更新用户失败'})
                    })
            }
        })
        .catch(error => {
            console.log(error)
            res.send({ status: FAIL, msg: '更新用户失败'})
        })
})
// 启用用户
router.post('/user-enable', (req,res) => {
    const { _id } = req.body
    UserModel.findOneAndUpdate({ _id }, { disabled: false })
        .then(user => {
            res.send({ status: SUCCESS, msg: '启用成功'})
        })
        .catch(error => {
            console.log(error)
            res.send({ status: FAIL, msg: '启用异常'})
        })
})
// 禁用用户
router.post('/user-disable', (req,res) => {
    const { _id } = req.body
    UserModel.findOneAndUpdate({ _id }, { disabled: true })
        .then(user => {
            res.send({ status: SUCCESS, msg: '禁用成功'})
        })
        .catch(error => {
            console.log(error)
            res.send({ status: FAIL, msg: '禁用异常'})
        })
})
// 删除用户
router.post('/user-delete', (req,res) => {
    const { _id } = req.body
    UserModel.findOneAndDelete({ _id })
        .then(user => {
            res.send({ status: SUCCESS, msg: '删除成功'})
        })
        .catch(error => {
            console.log(error)
            res.send({ status: FAIL, msg: '删除异常，请重新尝试'})
        })
})
// 根据用户_id查询用户信息
router.get('/user-information/:_id', (req,res) => {
    const _id = req.params._id
    UserModel.findOne({ _id })
        .then(user => {
            if (user) {
                res.send({ status: SUCCESS, data: user })
            } else {
                res.send({ status: FAIL, msg: '未找到该用户'})
            }
        })
        .catch(error => {
            console.log(error)
            res.send({ status: FAIL, msg: '查找用户失败'})
        })
})
// 根据用户名获取权限
router.get('/user-authority/:_id', (req,res) => {
    const _id = req.params._id
    UserModel.findOne({ _id })
        .then(user => {
            if(user) {
                res.send({ status: SUCCESS, data: { role: user.role }})
            } else {
                res.send({ status: FAIL, msg: '查询用户失败，请重试'})
            }
        })
        .catch(error => {
            console.log(error)
            res.send({ status: FAIL, msg: '获取用户权限失败，请重试'})
        })
    
})
// 获取各类人员的数量
router.get('/user-num', (req,res) => {
    UserModel.find()
        .then(users => {
            let teacher = 0
            let student = 0
            let guest = 0
            users.map(user => {
                switch (user.role) {
                    case 'teacher' :
                        teacher++
                        break
                    case 'student' :
                        student++
                        break
                    case 'guest' :
                        guest++
                        break
                }
            })
            res.send({ status: SUCCESS, data: { teacher, student, guest } })
        })
        .catch(error => {
            console.log(error)
            res.send({ status: FAIL, msg: '获取失败，请重新尝试'})
        })
})
// 获取班级，课程
router.get('/system-num', (req,res) => {
    CourseModel.find()
        .then(courses => {
            ClassModel.find()
                .then(c => {
                    res.send({ status: SUCCESS, data: { course: courses.length, classNum: c.length}})
                })
                .catch(error => {
                    console.log(error)
                    res.send({ status: FAIL, msg: '查询班级数量失败' })
                })
        })
        .catch(error => {
            console.log(error)
            res.send({ status: FAIL, msg: '查询课程数量失败' })
        })
})
// 根据学生_id获取课表信息
router.get('/student-timetable/:_id', (req, res) => {
    const _id = req.params._id
    UserModel.findOne({ _id })
        .then(student => {
            ClassModel.findOne({ _id:student.classBelong })
                .then(c => {
                    if (c) {
                        TimetableModel.findOne({ _id: c.timetable })
                            .then(timetable => {
                                res.send({ status: SUCCESS, data: { classNode:c, timetable } })
                            })
                            .catch(error => {
                                console.log(error)
                                res.send({ status: FAIL, msg: '获取课表失败' })
                            })
                    } else {
                        res.send({ status: SUCCESS, msg: '暂时未为该学生分配班级'})
                    }
                })
                .catch(error => {
                    console.log(error)
                    res.send({ status: FAIL, msg: '获取班级信息失败' })
                })
        })
        .catch(error => {
            console.log(error)
            res.send({ status: FAIL, msg: '查询该学生失败' })
        })
})

module.exports = router