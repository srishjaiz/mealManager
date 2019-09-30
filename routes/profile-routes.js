const router = require('express').Router();
const User = require('../models/user-model');
const Meal = require('../models/meal-model');

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


router.post('/addguest', authCheck, (req, res) => {
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
                    //initialising meal details for new user
                    Meal.create(
                        new Meal({
                            useremail: req.body.guestEmail
                        })
                    )
                    .then((newMeal)=>{
                        if(newMeal){
                            console.log("Meal details initialised: ", newMeal);
                        }
                        else{
                            //meal details not added
                            console.log("Meal details not initialised!")
                        }
                    })
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

router.post('/fetchEmails', authCheck, (req, res) => {
    let emails=[];
    User.find({isAdmin: false}).exec()
    .then(function(guests){
        guests.forEach(function(guest){
            // console.log(guest.useremail);
            emails.push(guest.useremail);
        });
        data={
            emails: emails
        }
        console.log(data);
    });
    res.writeHead(200, {
        'Content-Type': 'application/json'
    });
    res.end(JSON.stringify(data));
});

router.post('/removeguest', authCheck, (req, res) => {
    console.log("body: ",req.body.guestEmail);
    console.log("user: ",req.user);
    res.writeHead(200, {
        'Content-Type': 'application/json'
    });
    User.deleteOne({useremail: req.body.guestEmail}).then((removedUser)=>{
        if(removedUser.n){
            // console.log("user removed");

            Meal.deleteOne({useremail: req.body.guestEmail}).then((removedMeal)=>{
                if(removedMeal.n){
                    let data={
                        exists: true
                    }
                    res.end(JSON.stringify(data));            

                }
                else{
                    //meal not exist for the user
                    console.log("Meal doesn't not exist for selected guest")
                }
            });
        }
        else{
            console.log("guest doesn't not exist")
            let data={
                exists: false
            }
            res.end(JSON.stringify(data));            
        }
    });    
    
    
});



router.post('/fetchMealDetails', authCheck, (req, res) => {
    console.log(req.body.date);
    console.log(req.user);
    // db.scores.find(
    //     { results: { $elemMatch: { $gte: 80, $lt: 85 } } }
    //  )   
    res.writeHead(200, {
        'Content-Type': 'application/json'
    });
    let userReqMeal=false;  
    Meal.findOne({$and: [{useremail: req.user.useremail},{ mealsTaken: { $elemMatch: { date: req.body.date}}}]})
    .then((userTookMeal)=>{
        if(userTookMeal){
            userReqMeal=true;
            userTookMeal.mealsTaken.forEach(fn);
            function fn(obj, objIndex, mealsTakenArray){
                if(obj.date === req.body.date){
                    // console.log(obj.shift);
                    let resObj={
                        shift: obj.shift,
                        userReqMeal: userReqMeal,
                        user: req.user
                    };
                    res.end(JSON.stringify(resObj));
                }
            }
        }
        else{
            //user didn't request meal for that date
            let resObj={
                userReqMeal: userReqMeal,
                user: req.user
            };
            res.end(JSON.stringify(resObj));
        }
    })
    // let emails=[];
    // User.find({isAdmin: false}).exec()
    // .then(function(guests){
    //     guests.forEach(function(guest){
    //         // console.log(guest.useremail);
    //         emails.push(guest.useremail);
    //     });
    //     data={
    //         emails: emails
    //     }
    //     console.log(data);
    // });
    // res.writeHead(200, {
    //     'Content-Type': 'application/json'
    // });
    // res.end(JSON.stringify(req.user));
});

router.post('/setMealDetails', authCheck, (req, res) => {
    console.log(req.body);
    console.log(req.user);
    let mealObj={
        date: req.body.date,
        shift: req.body.shift,
        cost: 0
    };
    let sameDateFound=false;
    res.writeHead(200, {
        'Content-Type': 'application/json'
    });
    Meal.findOne({useremail: req.user.useremail})
    .then((currentUser)=>{
        if(currentUser){
            currentUser.mealsTaken.forEach(fn);
            function fn(obj, objIndex, mealsTakenArray){
                if(obj.date === req.body.date){
                    sameDateFound=true;
                    console.log("inside: ",sameDateFound);
                    Meal.update(
                        {useremail: req.user.useremail},
                        { $pull: {mealsTaken: { date: req.body.date}}}
                    ).then((removed)=>{
                        // console.log("removed obj: ", updated);
                        if(removed.n){
                            //obj with same date removed
                            Meal.update({useremail: req.user.useremail},
                                {
                                    $push:{
                                        mealsTaken: mealObj
                                    }
                                })
                            .then((mealTakenUpdated)=>{
                                // console.log(mealTakenUpdated);
                                if(mealTakenUpdated.n){
                                    //updated
                                    console.log("meal updated")
                                }
                                else{
                                    //if not updated
                                    console.log("meal not updated")
                                }
                            });
                        }
                        else{
                            //obj with same date not removed
                        }
                    });
                }
            }

            if(!sameDateFound){
                //same date not found
                Meal.update({useremail: req.user.useremail},
                    {
                        $push:{
                            mealsTaken: mealObj
                        }
                    })
                .then((mealTakenUpdated)=>{
                    // console.log(mealTakenUpdated);
                    if(mealTakenUpdated.n){
                        //updated
                        console.log("meal updated when not same date")
                    }
                    else{
                        //if not updated
                        console.log("meal not updated when not same date")
                    }
                });
            }
            let resObj={
                user: req.user,
                sameDateFound: sameDateFound
            }
            res.end(JSON.stringify(resObj));
        }
        else{
            console.log("invalid user");
            res.end(JSON.stringify(req.user));
        }
    });
});



router.post('/fetchMealsRequired', authCheck, (req, res) => {
    console.log(req.body);
    console.log(req.user);
    let shiftIndex;
    if(req.body.shiftInput=="Lunch")shiftIndex=1
    else if(req.body.shiftInput=="Breakfast")shiftIndex=0
    else if(req.body.shiftInput=="Dinner")shiftIndex=2
    else shiftIndex=-1
    res.writeHead(200, {
        'Content-Type': 'application/json'
    });
    let mealReqFound=false;  
    let veg=0,nonveg=0;
    Meal.find({ mealsTaken: { $elemMatch: { date: req.body.date}}}).exec()
    .then((usersReqMeal)=>{
        // console.log("users:",usersReqMeal);
        if(usersReqMeal[0]){
            mealReqFound=true;
            usersReqMeal.forEach((userReqMeal)=>{
                // console.log("user",userReqMeal);
                userReqMeal.mealsTaken.forEach(fn);
                function fn(obj, objIndex, mealsTakenArray){
                    if(obj.date === req.body.date){
                        // console.log(obj.shift);
                        obj.shift.forEach((mealType, index)=>{
                            // console.log("mealType:",mealType, "index:", index);
                            if(mealType==1 && index==shiftIndex){
                                veg++;
                            }
                            else if(mealType==2 && index==shiftIndex){
                                nonveg++;
                            }
                        })
                    }
                }
            })
            let resObj={
                veg: veg,
                nonveg: nonveg,
                mealReqFound: mealReqFound,
                user: req.user
            };
            res.end(JSON.stringify(resObj));
        }
        else{
            console.log("no meal req found");
            let resObj={
                mealReqFound: mealReqFound,
                user: req.user
            };
            res.end(JSON.stringify(resObj));
        }
    })
});

router.post('/updateMealCost', authCheck, (req, res) => {
    console.log(req.body);
    console.log(req.user);
    res.writeHead(200, {
        'Content-Type': 'application/json'
    });
    let shiftIndex;
    if(req.body.shiftInput=="Lunch")shiftIndex=1
    else if(req.body.shiftInput=="Breakfast")shiftIndex=0
    else if(req.body.shiftInput=="Dinner")shiftIndex=2
    else shiftIndex=-1
    
    let mealReqFound=false;  
    let veg=0,nonveg=0;
    Meal.find({ mealsTaken: { $elemMatch: { date: req.body.date}}}).exec()
    .then((usersReqMeal)=>{
        console.log("users:",usersReqMeal);
        if(usersReqMeal[0]){
            mealReqFound=true;
            usersReqMeal.forEach((userReqMeal)=>{
                // console.log("user",userReqMeal);
                userReqMeal.mealsTaken.forEach(fn);
                function fn(obj, objIndex, mealsTakenArray){
                    if(obj.date === req.body.date){
                        // console.log(obj.shift);
                        obj.shift.forEach((mealType, index)=>{
                            // console.log("mealType:",mealType, "index:", index);
                            if(mealType==1 && index==shiftIndex){
                                // veg++;
                                Meal.findOne({$and: [{useremail: userReqMeal.useremail}, {mealsTaken: { $elemMatch: { date: req.body.date}}}]})
                                .then((user)=>{
                                    if(user){
                                        // console.log("user",user);
                                        let oldCost;
                                        user.mealsTaken.forEach((obj, index)=>{
                                            if(obj.date==req.body.date){
                                                oldCost= obj.cost;
                                            }
                                        })
                                        
                                        // console.log("oldcost:",oldCost);
                                        let newCost= oldCost+40;
                                        Meal.update(
                                        {$and: [{useremail: userReqMeal.useremail},{"mealsTaken.date": req.body.date}]},
                                        { $set: { "mealsTaken.$.cost": newCost}}
                                        )
                                        .then((costUpdated)=>{
                                            if(costUpdated.n){
                                                console.log("updated")
                                            }
                                            else{
                                                //not updated
                                                console.log("not updated")
                                            }
                                        })
                                    }
                                    else{
                                        console.log("user not found!")
                                    }
                                })
                                
                            }
                            else if(mealType==2 && index==shiftIndex){
                                // nonveg++;
                                Meal.findOne({$and: [{useremail: userReqMeal.useremail}, {mealsTaken: { $elemMatch: { date: req.body.date}}}]})
                                .then((user)=>{
                                    if(user){
                                        // console.log("user",user);
                                        let oldCost;
                                        user.mealsTaken.forEach((obj, index)=>{
                                            if(obj.date==req.body.date){
                                                oldCost= obj.cost;
                                            }
                                        })
                                        // console.log("oldcost:",oldCost);
                                        let newCost= oldCost+60;
                                        Meal.update(
                                        {$and: [{useremail: userReqMeal.useremail},{"mealsTaken.date": req.body.date}]},
                                        { $set: { "mealsTaken.$.cost": newCost}}
                                        )
                                        .then((costUpdated)=>{
                                            if(costUpdated.n){
                                                console.log("updated")
                                            }
                                            else{
                                                //not updated
                                                console.log("not updated")
                                            }
                                        })
                                    }
                                    else{
                                        console.log("user not found!")
                                    }
                                })
                            }
                        })
                    }
                }
            })
            let resObj={
                mealReqFound: mealReqFound,
                user: req.user
            };
            console.log(resObj);
            res.end(JSON.stringify(resObj));
        }
        else{
            console.log("no meal req found");
            let resObj={
                mealReqFound: mealReqFound,
                user: req.user
            };
            console.log(resObj);
            res.end(JSON.stringify(resObj));
        }
    })
});
module.exports = router;