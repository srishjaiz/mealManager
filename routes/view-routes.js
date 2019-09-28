const router = require('express').Router();
const path= require('path');
const fs= require('fs');


const authCheck = (req, res, next) => {
    if(!req.user){
        // res.send(req.user);
        console.log(req.user);
        res.redirect('/');
    } else {
        next();
    }
};

router.get(/^(.+)$/, authCheck, (req,res)=>{
    try{
        if(fs.statSync(path.join(__dirname, '../', '/views', req.params[0]+'.html')).isFile()){
            res.sendFile(req.params[0]+'.html',{root: path.join(__dirname, '../', '/views')});            
        }
    }
    catch(err){
        console.log(err);
        res.sendFile('404.html',{root: path.join(__dirname, '../', '/views')});
    }
});

module.exports = router;