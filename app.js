const express= require("express");
const path= require('path');
const passportSetup = require('./config/passport-setup');
const compression= require('compression');
// const mongoConnect = require('./util/database').mongoConnect;
const mongoose = require('mongoose');
const cookieSession = require('cookie-session');
const passport = require('passport');
const router = require('./routes/auth-routes');
const viewRoutes = require('./routes/view-routes');
const profileRoutes = require('./routes/profile-routes');
const bodyParser = require('body-parser');

const app=express();

app.use(bodyParser.json());

// set up session cookies
app.use(cookieSession({
    maxAge: 24 * 60 * 60 * 1000,
    keys: ['thisiskeyforcookieencryption']
}));

// initialize passport
app.use(passport.initialize());
app.use(passport.session());

app.use('/css', express.static(__dirname+'/css'));
app.use('/script', express.static(__dirname+'/script'));
app.use(express.static(__dirname+'/public'));
app.use(express.static(__dirname+'/vanilla-calendar-master'));


app.use('/auth', router);
app.use('/profile', profileRoutes);


app.use(compression());

app.get('/', (req,res)=>{
    // res.render('index.html');
    res.sendFile('index.html',{root: path.join(__dirname, '/views')});
});
app.use('/', viewRoutes);





mongoose.connect(
    'mongodb+srv://mealSupplier:CfqNwxiQbsFHr7gM@mealmanager-r4zy2.mongodb.net/test?retryWrites=true&w=majority'
    ,{ useNewUrlParser: true,useUnifiedTopology: true })
.then(result => {
    app.listen(process.env.PORT || 1337,() => {
        console.log('listening');
    })
})
.catch(err => {
    console.log(err);
});