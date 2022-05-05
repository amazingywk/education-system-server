const mongoose = require('mongoose')

const paperSchema = new mongoose.Schema({
    papername: { type: String },
    problems: { type: Array },
    teacher: { type: Array },
    answer: { type: Array }
})

//定义Model(与集合对应，可以操作集合)
const PaperModel = mongoose.model('education_paper',paperSchema)


//向外暴露Model
module.exports = PaperModel