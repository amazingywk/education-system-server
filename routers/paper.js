
const express = require('express')

// 获取Model集合
const PaperModel = require('../models/PaperModel')

const { SUCCESS, FAIL } = require('../config/index')

// 得到路由器对象
const router = express.Router()

// 根据试卷_id获取试卷信息
router.get('/paper-info/:_id', (req,res) => {
    const _id = req.params._id
    PaperModel.findOne({ _id })
        .then(paper => {
            res.send({ status: SUCCESS, data: paper})
        })
        .catch(error => {
            console.log(error)
            res.send({ status: FAIL, msg: '获取试卷信息异常，请重新尝试' })
        })
})

// 创建试卷
router.post('/paper-create', (req,res) => {
    PaperModel.findOne({ papername: req.body.papername })
        .then(paper => {
            if (paper) {
                res.send({ status: FAIL, msg: '已存在该试卷名' })
            } else {
                PaperModel.create(req.body)
                    .then(paper => {
                        res.send({ status: SUCCESS, data: paper })
                    })
                    .catch(error => {
                        console.log(error)
                        res.send({ status: FAIL, msg: '添加异常，请重新尝试' })
                    })
            }
        })
        .catch(error => {
            console.log(error)
            res.send({ status: FAIL, msg: '添加异常，请重新尝试' })
        })
})

// 获取试卷列表
router.post('/paper-list', (req,res) => {
    const { papername, teacher } = req.body
    let search = {}
    if (teacher){
        search.teacher = teacher
    }
    let data = []
    PaperModel.find({ ...search })
        .then(c => {
            data = c
            if (papername){
                PaperModel.find({ "papername": { $regex:papername } })
                    .then(paper => {
                        let temp = []
                        for(let i = 0 ; i < data.length ; i++){
                            temp.push(data.papername)
                        }
                        let array = paper.filter(node => temp.indexOf(node.papername))
                        res.send({ status: SUCCESS, data: array})
                    })
                    .catch(error => {
                        console.log(error)
                        res.send({ status: FAIL, msg: '获取试卷列表失败，请重新尝试'})
                    })
            } else {
                res.send({ status: SUCCESS, data: data})
            }
        })
        .catch(error => {
            console.log(error)
            res.send({ status: FAIL, msg: '获取试卷列表失败，请重新尝试'})
        })
})

// 获取试卷可选项
router.get('/paper-options', (req,res) => {
    PaperModel.find()
        .then(papers => {
            let data = []
            papers.map(paper => {
                data.push({
                    value: paper._id,
                    label: paper.papername+'（'+paper.teacher[1]+'）',
                })
            })
            res.send({ status: SUCCESS, data })
        })
        .catch(error => {
            console.log(error)
            res.send({ status: FAIL, msg: '获取全部试卷失败，请重新尝试'})
        })
})

// 获取综合测评试卷
router.get('/paper-test', (req,res) => {
    PaperModel.findOne({ papername: '综合测评' })
        .then(paper => {
            res.send({ status: SUCCESS, data: paper })
        })
        .catch(error => {
            console.log(error)
            res.send({ status: FAIL, msg: '获取综合测评试卷失败'})
        })
})

// 编辑课程
router.post('/paper-update', (req,res) => {
    const { _id, papername } = req.body
    PaperModel.findOne({ papername })
        .then(paper => {
            if(paper && paper?._id != _id) {
                res.send({ status: FAIL, msg: '试卷名重复'})
            } else {
                PaperModel.findOneAndUpdate({ _id }, { ...req.body })
                    .then(paper => {
                        res.send({ status: SUCCESS, msg: '编辑试卷成功', data: paper })
                    })
                    .catch(error => {
                        console.log(error)
                        res.send({ status: FAIL, msg: '编辑课程失败，请重新尝试'})
                    })
            }
        })
})

module.exports = router

/*




// 创建课程
router.post('/paper-create', (req,res) => {
    const { number } = req.body
    PaperModel.findOne({ number })
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
*/