const mongoose = require('mongoose');
const passportlocalmongoose = require('passport-local-mongoose');
const schema = mongoose.Schema;

// const userschema = new schema({


//     email: {
//         type: String,
//         require: true,
//         unique: true
//     }
// });
const userschema = new schema({})

userschema.plugin(passportlocalmongoose);
module.exports = mongoose.model('user', userschema);