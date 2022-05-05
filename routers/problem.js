const express = require('express')

// 获取Model集合
const ProblemModel = require('../models/ProblemModel')

const { SUCCESS, FAIL, TESTANSWER } = require('../config/index')
const UserModel = require('../models/UserModel')

// 得到路由器对象
const router = express.Router()

// 根据题目_id获取题目信息
router.get('/problem-info/:_id', (req,res) => {
    const _id = req.params._id
    ProblemModel.findOne({ _id })
        .then(problem => {
            res.send({ status: SUCCESS, data: problem})
        })
        .catch(error => {
            console.log(error)
            res.send({ status: FAIL, msg: '获取试卷信息异常，请重新尝试' })
        })
})

// 创建题目
router.post('/problem-create', (req,res) => {
    ProblemModel.findOne({ number: req.body.question })
        .then(problem => {
            if (problem) {
                res.send({ status: FAIL, msg: '已存在该题目编号' })
            } else {
                ProblemModel.create(req.body)
                    .then(problem => {
                        res.send({ status: SUCCESS, data: problem })
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

// 获取题目列表
router.post('/problem-list', (req,res) => {
    const { keyword, isChoice } = req.body
    let search = {}
    if (isChoice){
        search.isChoice = isChoice
    }
    let data = []
    ProblemModel.find({ ...search })
        .then(c => {
            data = c
            if (keyword) {
                ProblemModel.find({ "keyword": { $regex:keyword } })
                    .then(problem => {
                        let temp = []
                        for(let i = 0 ; i < data.length ; i++){
                            temp.push(data.question)
                        }
                        let array = problem.filter(node => temp.indexOf(node.question))
                        res.send({ status: SUCCESS, data: array})
                    })
                    .catch(error => {
                        console.log(error)
                        res.send({ status: FAIL, msg: '获取题目列表失败，请重新尝试'})
                    })
            } else {
                res.send({ status: SUCCESS, data: data})
            }
        })
        .catch(error => {
            console.log(error)
            res.send({ status: FAIL, msg: '获取题目列表失败，请重新尝试'})
        })
})

// 编辑课程
router.post('/problem-update', (req,res) => {
    const { _id, number } = req.body
    ProblemModel.findOne({ number })
        .then(problem => {
            if(problem && problem?._id != _id) {
                res.send({ status: FAIL, msg: '题目编号重复'})
            } else {
                ProblemModel.findOneAndUpdate({ _id }, { ...req.body })
                    .then(problem => {
                        res.send({ status: SUCCESS, msg: '编辑题目成功', data: problem })
                    })
                    .catch(error => {
                        console.log(error)
                        res.send({ status: FAIL, msg: '编辑课程失败，请重新尝试'})
                    })
            }
        })
})

// 获取并提交综合测评成绩
router.post('/problem-test-score', (req,res) => {
    const { _id, answer } = req.body
    let num = 0
    let unit = 100/answer.length
    for(let i=0; i<answer.length; i++) {
        if(answer[i]===TESTANSWER[i]) {
            num++
        }
    }
    let score = num*unit
    UserModel.findOneAndUpdate({ _id }, { testScore: score})
        .then(user => {
            res.send({ status: SUCCESS, data: { user,score } })
        })
        .catch(error => {
            console.log(error)
            res.send({ status: FAIL, msg: '提价异常，请重新尝试' })
        })
})

module.exports = router