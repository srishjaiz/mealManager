const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: String,
    useremail: String,
    googleId: String
});

const User = mongoose.model('user', userSchema);

module.exports = User;

// const getDb = require('../util/database').getDb;

// function save(){
//     const db = getDb();
//     return db.collection('users')
//     .insertOne({"Email":"srishjaiz@gmail.com"})
//     .then(res => {
//         console.log(res);
//     })
//     .catch(err => {
//         console.log(err);
//     });
// }

// module.exports = save;

