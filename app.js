const express = require('express');
const { json } = require('express/lib/response');
const passport = require('passport');
const cookie = require('cookie-parser');
const session = require('express-session');

const app = express();

app.set('view engine','ejs');

app.use(express.urlencoded({extended:false}));
app.use(express(json));
app.use(express.static("public"));
app.use(cookie('el secreto'))


app.use('/resources',express.static('public'));
app.use('/resources',express.static(__dirname+'/public'));

app.use(session({
    secret: 'el secreto',
    resave: true,
    saveUninitializad: true
}));

app.use(passport.initialize());
app.use(passport.session());

app.get('/logout', function (req, res) {
    req.session.destroy();
    res.redirect('login');
});

app.use('/login',require('./router/login'));

//app.use('/empleado',require('./router/empleado'));

app.use('/',(req, res, next)=>{
    if(req.isAuthenticated()){ return next();}
    else{ res.redirect("/login") }
},require('./router/home'));

app.listen(5000, ()=>{
    console.log('ubicacion: '+__dirname);
    console.log('Server corriendo en http://localhost:5000');
});