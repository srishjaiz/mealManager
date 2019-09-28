const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const keys = require('./keys');
const User = require('../models/user-model');

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id).then((user) => {
        done(null, user);
    });
});

passport.use(
    new GoogleStrategy({
        // options for google strategy
        clientID: keys.google.clientID,
        clientSecret: keys.google.clientSecret,
        callbackURL: '/auth/google/redirect'
    }, (accessToken, refreshToken, profile, done) => {
        // passport callback function
        console.log('passport callback function fired:');
        // console.log(profile);
        // console.log(profile.emails[0].value);
        console.log(profile);
        User.findOne({useremail: profile.emails[0].value}).then((validUser)=>{
            if(validUser){
                User.findOne({$and:[{useremail: profile.emails[0].value},{username: profile.displayName}]}).then((oldUser)=>{
                    if(oldUser){
                        console.log('user is: ', oldUser);
                        done(null, oldUser);
                    }
                    else{
                        //new user

                        User.remove({useremail: profile.emails[0].value}).then((removedUser)=>{
                            if(removedUser){
                                new User({
                                    googleId: profile.id,
                                    username: profile.displayName,
                                    useremail: profile.emails[0].value,
                                    userpic: profile._json['picture']
                                    // isAdmin: false
                                }).save().then((newUser) => {
                                    console.log('created new user: ', newUser);
                                    done(null, newUser);
                                    // do something
                                });
                            }
                            // console.log('created new user: ', newUser);
                            // done(null, newUser);
                        });
                        // User.updateOne({useremail: profile.emails[0].value},{
                        //     $set: {
                        //         googleId: profile.id,
                        //         username: profile.displayName,
                        //         // useremail: profile.emails[0].value,
                        //         userpic: profile._json['picture']
                        //     }
                        // },{multi:true}).then((newUser)=>{
                        //     console.log('created new user: ', newUser);
                        //     done(null, newUser);
                        // })
                        // new User({
                        //     googleId: profile.id,
                        //     username: profile.displayName,
                        //     useremail: profile.emails[0].value,
                        //     userpic: profile._json['picture']
                        //     // isAdmin: false
                        // }).save().then((newUser) => {
                        //     console.log('created new user: ', newUser);
                        //     done(null, newUser);
                        //     // do something
                        // });
                    }
                })
            }
            else{
                //invalid user
                // console.log("invalid user");
                done(null, null);
                // next();
            }
        });
            // User.findOne({googleId: profile.id}).then((currentUser) => {
            //     if(currentUser){
            //         // already have this user
            //         console.log('user is: ', currentUser);
            //         done(null, currentUser);
            //         // do something
            //     } else {
            //         // if not, create user in our db
            //         new User({
            //             googleId: profile.id,
            //             username: profile.displayName,
            //             useremail: profile.emails[0].value,
            //             userpic: profile._json['picture'],
            //             isAdmin: false
            //         }).save().then((newUser) => {
            //             console.log('created new user: ', newUser);
            //             done(null, newUser);
            //             // do something
            //         });
            //     }
            // });
        
    })
);