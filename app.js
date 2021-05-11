if (process.env.NODE_ENV != "production") {
    require('dotenv').config({ path: '.env' });
}

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const passport = require('passport');
const path = require('path');
const session = require('express-session');
const local = require('passport-local');
const user = require('./user');
const { getMaxListeners } = require('process');
const ejsmate = require('ejs-mate');
const router = express.Router();
const flash = require('connect-flash');
const mongosanitize = require('express-mongo-sanitize');
const helmet = require('helmet');

// ||
// 'mongodb://localhost:27017/newweb'    || 
const dburl = process.env.DB_URL;

const usersroute = require('./routes/users');
const expressEjsLayouts = require('express-ejs-layouts');
const MongodbStore = require("connect-mongo")(session);

app.use(flash());
app.use(expressEjsLayouts);
app.engine('ejs', ejsmate);
app.set('view engine', 'ejs');



app.set('views', path.join(__dirname, 'views'));

const store = new MongodbStore({
    url: dburl,
    secret: 'kkkk',
    touchAfter: 24 * 60 * 60

});
store.on("error", function(e) {
    console.log("session store error", e);
})

const sessionconfig = {
    store,
    secret: 'kkkk',
    resave: false,
    saveUninitialized: true,

    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24,
        maxAge: 1000 * 60 * 60 * 24,

    }
}

app.use(express.urlencoded({ extended: false }));



app.use(session(sessionconfig));

app.use(passport.initialize());
app.use(passport.session());


// passport.use(new local(
//     function(email, password, done) {
//         User.findOne({ email: email }, function(err, user) {
//             if (err) { return done(err); }
//             if (!user) { return done(null, false); }
//             if (!user.verifyPassword(password)) { return done(null, false); }
//             return done(null, user);
//         });
//     }
// ));


// app.use(mongosanitize);
// app.use(helmet({ contentSecurityPolicy: false }));
passport.use(new local(user.authenticate()));
passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());

app.use(express.json());


// 'mongodb://localhost:27017/newweb'
mongoose.connect(dburl, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
});




const db = mongoose.connection;
db.on('error', console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("database connected");

});

app.use((req, res, next) => {

    res.locals.currentuser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');




    next();
})
app.use('/', usersroute);
app.get('/', async(req, res) => {
    req.flash('success', 'WELCOME!!');
    res.render('home');


});



app.use((req, res) => {
    res.send('  NOT FOUND!!');
    console.log('not found');
})
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`port ${port}`);
})