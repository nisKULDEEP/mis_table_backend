const mongoose = require('mongoose');

const validator = require('validator');
// const bcrypt = require('bcryptjs');

const reportSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      require: [true, 'Please tell your company name'],
    },
    quantity: {
      type: Number,
      require: [true, 'Please tell total quantity'],
    },
    sales: {
      type: Number,
      require: [true, 'Please tell amount of sales'],
    },
    month: {
      type: String,
      require: [true, 'Please tell the month of sales'],
    },
    date: {
      type: String,
      require: [true, 'Please tell the date of sales'],
    },
    report_type: {
      type: String,
      require: [true, 'Please tell the report type'],
    },
    //   createdAt: { type: String, default: new Date().toISOString().split('T')[0] },
  },
  {
    timestamps: true,
  }
);

// //decrypt password
// reportSchema.pre('save', async function (next) {
//   //only run if password is not modified
//   if (!this.isModified('password')) return next();

//   this.password = await bcrypt.hash(this.password, 12);

//   this.passwordConfirm = undefined;

//   next();
// });

// reportSchema.methods.correctPassword = async (incomingPassword, userPassword) =>
//   await bcrypt.compare(incomingPassword, userPassword);

module.exports = mongoose.model('Report', reportSchema);
