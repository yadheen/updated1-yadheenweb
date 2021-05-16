const express = require('express');
const router = express.Router();
const user = require('../user.js');
router.use(express.json());
const catchasync = require('../catchasync');
const passport = require('passport');
const flash = require('connect-flash');


router.get('/register', async(req, res) => {
    res.render('../views/register');
});


router.post('/register', catchasync(async(req, res, next) => {
    try {

        const username = req.body.username;
        const email = req.body.email;

        const password = req.body.password;

        const newuser = new user({ username, email });

        const reguser = await user.register(newuser, password);


        req.login(reguser, err => {
            if (err) return next(err);
            req.flash('success', 'successfully registered!');
            res.redirect('/secret');
        });





    } catch (e) {

        req.flash('error', e.message);

        res.redirect('../views/register');
    }


}));

router.get('/login', async(req, res) => {
    res.render('../views/login');
});

router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), async(req, res) => {
    req.flash('success', 'welcome back');
    const redirecturl = req.session.returnTo || 'secret';
    delete req.session.returnTo;

    res.redirect(redirecturl);


});


router.get('/secret', async(req, res) => {
    if (!req.isAuthenticated()) {
        req.flash('error', 'you must have logged in!');
        return res.redirect('/login');
    }
    res.render('../views/secret');
})
router.get('/logout', async(req, res) => {
    req.logout();
    res.redirect("/");
})


module.exports = router;