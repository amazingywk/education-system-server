const mongoose = require('mongoose')

const timetableSchema = new mongoose.Schema({
    amonday1: { type: Array },
    amonday2: { type: Array },
    amonday3: { type: Array },
    amonday4: { type: Array },
    btuesday1: { type: Array },
    btuesday2: { type: Array },
    btuesday3: { type: Array },
    btuesday4: { type: Array },
    cwednesday1: { type: Array },
    cwednesday2: { type: Array },
    cwednesday3: { type: Array },
    cwednesday4: { type: Array },
    dthursday1: { type: Array },
    dthursday2: { type: Array },
    dthursday3: { type: Array },
    dthursday4: { type: Array },
    efriday1: { type: Array },
    efriday2: { type: Array },
    efriday3: { type: Array },
    efriday4: { type: Array },
    fsaturday1: { type: Array },
    fsaturday2: { type: Array },
    fsaturday3: { type: Array },
    fsaturday4: { type: Array },
    gsunday1: { type: Array },
    gsunday2: { type: Array },
    gsunday3: { type: Array },
    gsunday4: { type: Array },
})

//定义Model(与集合对应，可以操作集合)
const TimetableModel = mongoose.model('education_timetable',timetableSchema)


//向外暴露Model
module.exports = TimetableModel