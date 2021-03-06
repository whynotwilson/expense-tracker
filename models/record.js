const mongoose = require('mongoose')
const Schema = mongoose.Schema

const recordSchema = new Schema({
  name: {
    type: String,
    require: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  category: {
    type: String,
    require: true
  },
  amount: {
    type: Number,
    require: true
  },
  merchant: {
    type: String
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    index: true,
    require: true
  }
})

module.exports = mongoose.model('Record', recordSchema)
