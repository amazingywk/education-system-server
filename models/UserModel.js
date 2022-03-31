const mongoose = require('mongoose')


const userSchema = new mongoose.Schema({
    username:{type: String,  required: true},
    password:{type: String, required: true}
})

//定义Model(与集合对应，可以操作集合)
const UserModel = mongoose.model('education_users',userSchema)

//向外暴露Model
module.exports = UserModel