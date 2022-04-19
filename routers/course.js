
const express = require('express')

// 获取Model集合
const CourseModel = require('../models/CourseModel')

const { SUCCESS, FAIL } = require('../config/index')

// 得到路由器对象
const router = express.Router()

// 获取课程列表
router.post('/course-list', (req,res) => {
    const { coursename, number } = req.body
    let search = {}
    if (number){
        search.number = number
    }
    let data = []
    CourseModel.find({ ...search })
        .then(c => {
            data = c
            if (coursename){
                CourseModel.find({ "coursename": { $regex:coursename } })
                    .then(cc => {
                        let temp = []
                        for(let i = 0 ; i < data.length ; i++){
                            temp.push(data.coursename)
                        }
                        let array = cc.filter(node => temp.indexOf(node.coursename))
                        res.send({ status: SUCCESS, data: array})
                    })
            } else {
                res.send({ status: SUCCESS, data: data})
            }
        })
        .catch(error => {
            console.log(error)
            res.send({ status: FAIL, msg: '获取课程列表失败，请重新尝试'})
        })
})
// 创建课程
router.post('/course-create', (req,res) => {
    const { number } = req.body
    CourseModel.findOne({ number })
        .then(course => {
            if(course) {
                res.send({ status: FAIL, msg: '编号重复'})
            } else {
                CourseModel.create(req.body)
                    .then(course => {
                        res.send({ status: SUCCESS, data: course})
                    })
                    .catch(error => {
                        console.log(error)
                        res.send({ status: FAIL, msg: '创建课程失败，请重新尝试'})
                    })
            }
        })
        .catch(error => {
            console.log(error)
            res.send({ status: FAIL, msg: '创建课程异常，请重新尝试'})
        })
})
// 编辑课程
router.post('/course-update', (req,res) => {
    const { _id, number } = req.body
    CourseModel.findOne({ number })
        .then(course => {
            if(course && course?._id != _id) {
                res.send({ status: FAIL, msg: '编号重复'})
            } else {
                CourseModel.findOneAndUpdate({ _id }, { ...req.body })
                    .then(course => {
                        res.send({ status: SUCCESS, msg: '编辑课程成功', data: course })
                    })
                    .catch(error => {
                        console.log(error)
                        res.send({ status: FAIL, msg: '编辑课程失败，请重新尝试'})
                    })
            }
        })
})
// 获取全部课程可选项
router.get('/course-options', (req,res) => {
    CourseModel.find()
        .then(courses => {
            let data = []
            courses.map(course => {
                data.push({
                    value: course._id,
                    label: course.coursename+'('+course.number+')',
                    teacher: course.teacher.length?course.teacher[1]:null,
                })
            })
            res.send({ status: SUCCESS, data })
        })
        .catch(error => {
            console.log(error)
            res.send({ status: FAIL, msg: '获取全部课程失败，请重新尝试'})
        })
})

module.exports = router