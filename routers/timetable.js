
const express = require('express')

// 获取Model集合
const TimetableModel = require('../models/TimetableModel')

const { SUCCESS, FAIL } = require('../config/index')

// 得到路由器对象
const router = express.Router()

// 编辑课表
router.post('/timetable-update', (req, res) => {
    const { _id } = req.body
    TimetableModel.findOneAndUpdate({ _id }, { ...req.body } )
        .then(timetable => {
            res.send({ status: SUCCESS, msg: '修改课表成功' })
        })
        .catch(error => {
            console.log(error)
            res.send({ status: FAIL, msg: '修改课表失败' })
        })
})

module.exports = router