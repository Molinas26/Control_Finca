const express = require('express');
const router = express.Router();
const passport = require('passport');
const bcryptjs = require("bcryptjs");
const cookie = require('cookie-parser');
const session = require('express-session');
const PassportLocal = require('passport-local').Strategy;
const { body, validationResult } = require('express-validator');

const conexion = require('../database/db');

passport.use(new PassportLocal(function(username, password, done){
    conexion.query("select * from users where email='"+username+"'", async (error, results)=>{
        if (results.rowCount == 0 || !(await bcryptjs.compare(password, results.rows[0].password))) {
            done(null, false);
        }else{
            return done(null, results.rows[0], );
        }
    })
}));

passport.serializeUser((user,done)=>{
    done(null, user.id);
});

passport.deserializeUser((id,done)=>{
    conexion.query("select * from users where id='"+id+"'", (error, results)=>{
        done(null, results.rows[0]);
    })
});

router.post('/', passport.authenticate('local',{
    successRedirect: '/',
    failureRedirect: '/login'
}));

router.get('/',(req, res)=>{
    res.render('login');
});
module.exports = router;