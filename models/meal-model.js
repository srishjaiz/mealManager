const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    useremail: String,
    mealsTaken: {
        type: Array,
        default: []
        // date : { type : Array , "default" : [] }
    }
});

const Meal = mongoose.model('meal', userSchema);

module.exports = Meal;
