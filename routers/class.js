
const express = require('express')

const { SUCCESS, FAIL } = require('../config/index')


// 获取Model集合
const ClassModel = require('../models/ClassModel')
const UserModel = require('../models/UserModel')
const TimetableModel = require('../models/TimetableModel')

// 得到路由器对象
const router = express.Router()

// 创建班级
router.post('/class-create', (req,res) => {
    const { number, students } = req.body
    ClassModel.findOne({ number })
        .then(c => {
            if(c) {
                res.send({ status: FAIL, msg: '编号重复，请重新尝试' })
            } else {
                TimetableModel.create(null)
                    .then(timetable => {
                        ClassModel.create({ ...req.body, timetable: timetable._id})
                            .then(cc => {
                                res.send( { status: SUCCESS, data: cc })
                                for(let i = 0; i<students.length; i++) {
                                    UserModel.findOneAndUpdate({ _id:students[i] }, { classBelong: cc._id })
                                        .catch(error => {
                                            console.log(error)
                                        })
                                }
                            })
                            .catch(error => {
                                console.log('添加班级异常', error)
                                res.send({ status:FAIL,msg:'添加班级异常，请重新尝试' })
                            })
                    })
                    .catch(error => {
                        console.log('添加班级异常', error)
                        res.send({ status:FAIL,msg:'添加课程异常，请重新尝试' })
                    })
                
            }
        })
        .catch(error => {
            console.log('添加班级异常', error)
            res.send({status:FAIL,msg:'添加班级异常，请重新尝试'})
        })
})
// 编辑班级
router.post('/class-update', (req,res) => {
    const { _id,number } = req.body
    ClassModel.findOne({ number })
        .then(c => {
            if(c && c._id != _id) {
                res.send({ status: FAIL, msg: '编号重复，请重新尝试' })
            } else {
                ClassModel.findOneAndUpdate({ _id }, { ...req.body })
                    .then(c => {
                        res.send({ status: SUCCESS, msg: '编辑班级成功' })
                    })
                    .catch(error => {
                        console.log(error)
                        res.send({ status: FAIL, msg: '编辑班级失败，请重新尝试'})
                    })
            }
        })
        .catch(error => {
            console.log('添加班级异常', error)
            res.send({status:FAIL,msg:'添加班级异常，请重新尝试'})
        })
})
// 获取班级列表
router.post('/class-list', (req,res) => {
    const { classname, number } = req.body
    let search = {}
    if (number){
        search.number = number
    }
    let data = []
    ClassModel.find({ ...search })
        .then(c => {
            data = c
            if (classname){
                ClassModel.find({ "classname": { $regex:classname } })
                    .then(cc => {
                        let temp = []
                        for(let i = 0 ; i < data.length ; i++){
                            temp.push(data.classname)
                        }
                        let array = cc.filter(node => temp.indexOf(node.classname))
                        res.send({ status: SUCCESS, data: array})
                    })
            } else {
                res.send({ status: SUCCESS, data: data})
            }
        })
})
// 根据班级_id获取信息与课表信息
router.get('/class-information/:_id', (req,res) => {
    const _id = req.params._id
    ClassModel.findOne({ _id })
        .then(c => {
            TimetableModel.findOne({ _id: c.timetable })
                .then(timetable => {
                    res.send({ status: SUCCESS, data: { classNode:c, timetable } })
                })
                .catch(error => {
                    console.log(error)
                    res.send({ status: FAIL, msg: '获取课表失败' })
                })
        })
        .catch(error => {
            console.log(error)
            res.send({ status: FAIL, msg: '获取班级信息失败' })
        })
})

module.exports = router