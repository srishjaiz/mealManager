const express= require("express");
const path= require('path');
const fs= require('fs');
const authRoutes = require('./routes/auth-routes');
const passportSetup = require('./config/passport-setup');
const compression= require('compression');
// const mongoConnect = require('./util/database').mongoConnect;
const mongoose = require('mongoose');

const app=express();

app.use('/css', express.static(__dirname+'/css'));
app.use('/script', express.static(__dirname+'/script'));
app.use(express.static(__dirname+'/public'));
app.use(express.static(__dirname+'/vanilla-calendar-master'));
app.use(compression());
app.use('/auth', authRoutes);

app.get('/', (req,res)=>{
    // res.render('index.html');
    res.sendFile('index.html',{root: path.join(__dirname, '/views')});
});

app.get(/^(.+)$/, (req,res)=>{
    try{
        if(fs.statSync(path.join(__dirname, '/views', req.params[0]+'.html')).isFile()){
            res.sendFile(req.params[0]+'.html',{root: path.join(__dirname, '/views')});            
        }
    }
    catch(err){
        console.log(err);
        res.sendFile('404.html',{root: path.join(__dirname, '/views')});
    }
});



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