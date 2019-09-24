const router = require('express').Router();
const path= require('path');
const passport = require('passport');

// auth login
router.get('/login', (req, res) => {
    try{
        res.sendFile('login.html',{root: path.join(__dirname, '../', '/views')});
    }
    catch(err){
        console.log(err);
        res.sendFile('404.html',{root: path.join(__dirname, '../', '/views')});
    }
});

// auth logout
router.get('/logout', (req, res) => {
    // handle with passport
    res.send('logging out');
});

// auth with google+
router.get('/google', passport.authenticate('google', {
    scope: ['profile']
}));


// callback route for google to redirect to
// hand control to passport to use code to grab profile info
router.get('/google/redirect', passport.authenticate('google'), (req, res) => {
    res.send('you reached the redirect URI');
});

module.exports = router;
