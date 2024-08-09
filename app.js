const express = require('express');
const session = require('cookie-session');
const cookieParser = require('cookie-parser');
const cookieOnly = require('cookie');
const path = require('path');
require('dotenv').config();
const {authGithub} = require('./API/githubAuth');
const {SSOLogin} = require('./controller/login');
const {Visit} = require('./controller/Visit');
const { Database } = require('./controller/db');
const { checkReferal } = require('./API/referal');
const { loadViews } = require('./controller/makeViews');
const { render } = require('ejs');
const fs = require('fs');
const port = process.env.PORT || 8080;
const app = express();
app.use(cookieParser());
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(session({
    secret: process.env.sessionSecret, // Replace with your own secret key
    resave: false,           // Prevents resaving session if unmodified
    saveUninitialized: true, // Save new but unmodified sessions
    cookie: { secure: false } // Set to true if using HTTPS
}));
const commonFunctions = async (req, res, next) => {
    app.post('/API/logout', async (req, res) =>{
        const authLogin = await SSOLogin.authenticateLogin(req);
        if (authLogin.status) {
            res.clearCookie('UID');
            res.json({status:true, log:"Logged out successfully"});
        }else{
            res.json({status:true, log:"Logged out successfully"});
        }
        return next();
    });
    await Visit.initialize(req, res);
    next();
};

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'src')));
// app.use(express.urlencoded());
app.use(express.json());
app.use(commonFunctions);

// Routes
app.get('/', async (req, res) => {
    var data = await loadViews.dashboard(req);
    res.render('home', {data});
});
app.get('/account', async (req, res) => {
    const authLogin = await SSOLogin.authenticateLogin(req);
    var data = await loadViews.account(req);
    if (authLogin.status){
        res.render('account', {data});
    }else{
        res.redirect('/login');
    }
    
});

app.get('/login', async (req, res) => {
    const authLogin = await SSOLogin.authenticateLogin(req);
    if (authLogin.status){
        res.redirect('/account');
    }else{
        res.render('login');
    }
});



app.get('/API/js', (req, res) => {
    res.json({
     gt_client: process.env.gt_client,
     redirect: process.env.redirect,
    });
});

app.get('/API/checkReferal', (req, res) => {
    var referalStatus = checkReferal(req, res);
    res.json({
        referalStatus: referalStatus,
       });
});

app.get('/auth/github', async (req, res) => {
    const userInfo = await authGithub(req, process.env.gt_client, process.env.gt_secret);
    userInfo.authType = 'Github';
    const isLogged = await SSOLogin.Login(req, res, userInfo);
    if (isLogged.status) {
        res.redirect('/account');
    }else{
        res.redirect('/login');
    }
});

app.post('/auth/google', async (req, res) => {
    const userInfo = req.body;
    userInfo.authType = 'Google';
    delete userInfo.username;
    const isLogged = await SSOLogin.Login(req, res, userInfo);
    if (isLogged.status) {
        res.json({status:true, log:"Logged sucessfully"});
    }else{
        res.json({status:false, log:isLogged.log});
    }
});



app.get('/roadmap', async (req, res) => {
    res.render('roadmap');
});

app.get('/terms-conditions', async (req, res) => {
    var data = await loadViews.docPages(req);
    res.render('terms-conditions', {data});
});
app.get('/privacy-policy', async (req, res) => {
    var data = await loadViews.docPages(req);
    res.render('privacy-policy', {data});
});

app.get('/support', async (req, res) => {
    var data = await loadViews.support(req);
    res.render('support', {data});
});

const renderSitemap = (req, res) => {
    res.set('Content-type','Application/xml');
    res.render('sitemap');
};

app.get('/whitepaper', async (req, res) => {
        const filePath = path.join(__dirname, 'src', 'files', 'Whitepaper_V1.pdf')

        // Read the PDF file
        fs.readFile(filePath, (err, data) => {
            if (err) {
                console.error('Error reading PDF file:', err);
                res.status(500).send('Internal Server Error');
                return;
            }
            // Set the content type to application/pdf
            res.setHeader('Content-Type', 'application/pdf');
            res.send(data);
        });
});

app.get('/sitemap', renderSitemap);
app.get('/sitemap.xml', renderSitemap);
// Starting Server
app.listen(port, () => {
    
    console.log(`Server is running on http://localhost:${port}`);
});