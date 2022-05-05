const mongoose = require('mongoose')

const problemSchema = new mongoose.Schema({
    question: { type: String },
    number: { type: String },
    isChoice: { type: Boolean, default: false },
    choices: { type: Array },
    answer: { type: String },
    keyword: { type: String },
})

//定义Model(与集合对应，可以操作集合)
const ProblemModel = mongoose.model('education_problem',problemSchema)


//向外暴露Model
module.exports = ProblemModel