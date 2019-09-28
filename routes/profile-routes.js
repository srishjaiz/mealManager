const router = require('express').Router();

const authCheck = (req, res, next) => {
    if(!req.user){
        // res.send(req.user);
        console.log(req.user);
        res.redirect('/auth/login');
    } else {
        next();
    }
};

router.get('/', authCheck, (req, res) => {
    res.send('you are logged in, this is your profile - ' + req.user.username);
});

router.get('/userprofile', authCheck, (req, res) => {
    res.writeHead(200, {
        'Content-Type': 'application/json'
    });
    res.end(JSON.stringify(req.user));
});

module.exports = router;
