const mongoose = require('mongoose')

const traineeSchema = new mongoose.Schema({
    username: { type: String, required: true },
    password: { type: String, required: true },
    gender: { type: String, required: true },
    role: { type: String, required: true },
    disabled: { type: Boolean, default: true}
})

//定义Model(与集合对应，可以操作集合)
const TraineeModel = mongoose.model('education_trainee',traineeSchema)


//向外暴露Model
module.exports = TraineeModel