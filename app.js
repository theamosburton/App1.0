const express = require('express');
const session = require('cookie-session');
const cookieParser = require('cookie-parser');
const cookieOnly = require('cookie');
const path = require('path');
require('dotenv').config();
const { Database } = require('./controller/db');
const { checkReferal } = require('./API/referal');
// const {tuloWallet} = require('./controller/tuloWallet');
const {myBatchWallet} = require('./controller/createWallet');
const { render } = require('ejs');
const fs = require('fs');
const { generateCaptcha, verifyCaptcha } = require('./API/captcha');
const port = process.env.PORT || 8080;
const app = express();
app.use(cookieParser());
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(session({
    secret: process.env.sessionSecret, 
    resave: false,           
    saveUninitialized: true, 
    cookie: { secure: false } 
}));


app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'src')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.get('/', async (req, res) => {
//     res.render('home');
// });
app.post('/API/captchaVarification', (req, res) => {
    let verifyCap1 = verifyCaptcha(req.body.cap1, req.body.CapT1);
    let verifyCap2 = verifyCaptcha(req.body.cap2, req.body.CapT2);
    let purpose = req.body.purpose;
    if(verifyCap1 && verifyCap2){
        if (purpose == "creation") {
            const newWallet = myBatchWallet.createWallet();
            res.json({
                status: true,
                walletAddress : newWallet.walletAddress,
                walletSeed : newWallet.seedPhrase,
                walletKey : newWallet.privateKey
               });
        }else if (purpose == "recovery") {
            console.log("recovery")
        }else{
            res.json({
                status: false,
                captchaFail : "Purpose not found"
               });
        }
    }else if(!verifyCap1 && !verifyCap2){
        res.json({
            status: false,
            captchaFail : "both"
           });
    }else if (verifyCap1 && !verifyCap2) {
        res.json({
            status: false,
            captchaFail : "two"
           });
    }else if(!verifyCap1 && verifyCap2){
        res.json({
            status: false,
            captchaFail : "one"
           });
    }
});


app.post('/API/captcha/generateCaptcha', async (req, res) => {
    let newCaptcha = await generateCaptcha();
    res.json({
        captcha: newCaptcha.captchaImage,
        token : newCaptcha.encryptedText.encryptedData
       });

});

app.get('/login', async (req, res) => {
    res.render('login');
});


app.post('/API/checkReferal', (req, res) => {
    var referalStatus = checkReferal(req, res);
    res.json({
        referalStatus: referalStatus,
       });
});



app.get('/roadmap', async (req, res) => {
    res.render('roadmap');
});

app.get('/security-recovery', async (req, res) => {
    var views = loadViews;
    var data = await views.docPages(req);
    var appInfo = views.appInfo;
    res.render('security-recovery', {data, appInfo});
});
app.get('/privacy-policy', async (req, res) => {
    var views = loadViews;
    var data = await views.docPages(req);
    var appInfo = views.appInfo;
    res.render('privacy-policy', {data, appInfo});
});

// app.get('/support', async (req, res) => {
//     var data = await loadViews.support(req);
//     res.render('support', {data});
// });

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