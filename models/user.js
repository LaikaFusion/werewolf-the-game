const passportLocalMongoose = require('passport-local-mongoose');
const mongoose = require('mongoose');

let userSchema = mongoose.Schema(
  {
    username: String,
    password: String,
    firstName: String,
    lastName: String
  },
  { usePushEach: true }
);

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema);
