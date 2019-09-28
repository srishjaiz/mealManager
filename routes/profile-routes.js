const router = require('express').Router();
const User = require('../models/user-model');

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


router.post('/usermanage', authCheck, (req, res) => {
    console.log("body: ",req.body.guestEmail);
    console.log("user: ",req.user);
    // try {
    //     db.products.insertOne( { _id: 10, "item" : "packing peanuts", "qty" : 200 } );
    //  } catch (e) {
    //     print (e);
    //  }
    res.writeHead(200, {
        'Content-Type': 'application/json'
    });
    User.findOne({useremail: req.body.guestEmail}).then((userExists)=>{
        if(userExists){
            let data={
                user: userExists,
                exists: true
            }
            // console.log(data);
            res.end(JSON.stringify(data));            
        }
        else{
            //new guest must be added
            User.create(
                new User({
                    useremail: req.body.guestEmail
                }))
            .then((newUser)=>{
                if(newUser){
                    console.log("data inserted", newUser);
                    let data={
                        user: newUser,
                        exists: false
                    }
                    res.end(JSON.stringify(data));
                }
                else{
                    console.log("insertion failed!");
                }
            });
        }
    });
});

module.exports = router;