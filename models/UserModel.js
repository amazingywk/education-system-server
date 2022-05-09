const mongoose = require('mongoose')
const md5 = require('blueimp-md5')


const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    password: { type: String, required: true },
    phone: { type: Number, required: false },
    gender: { type: String, required: true },
    role: { type: String, required: true },
    disabled: { type: Boolean, default: false },
    classBelong: {type: String, default: null },
    testScore: { type: Number, default: -1 }
})

//定义Model(与集合对应，可以操作集合)
const UserModel = mongoose.model('education_users',userSchema)


// 初始化默认超级管理员用户：admin/123456
UserModel.findOne({username: 'admin'}).then(user=>{
    if(!user) {
      UserModel.create({
        username:'admin',
        password: md5('123456'),
        phone: 12345678910,
        gender: 'male',
        role: 'admin',
        disabled: false,
      })
        .then(user => {
          console.log('初始化用户: 用户名: admin 密码为: 123456')
        })
    }
  })

//向外暴露Model
module.exports = UserModel