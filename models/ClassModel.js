const mongoose = require('mongoose')

const classSchema = new mongoose.Schema({
    classname: { type: String, required: true },
    number: { type: String, required: true },
    teacher: { type: Array },
    students: { type: Array },
    timetable: { type: String },
    paper: { type: Array }
})

//定义Model(与集合对应，可以操作集合)
const ClassModel = mongoose.model('education_class',classSchema)


//向外暴露Model
module.exports = ClassModel