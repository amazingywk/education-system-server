const mongoose = require('mongoose')

const courseSchema = new mongoose.Schema({
    coursename: { type: String, required: true },
    number: { type: String, required: true },
    teacher: { type: Array }
})

//定义Model(与集合对应，可以操作集合)
const CourseModel = mongoose.model('education_course',courseSchema)


//向外暴露Model
module.exports = CourseModel