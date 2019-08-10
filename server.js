let express = require('express');
let multer = require("multer");
let upload = multer();
let app = express();
let cookieParser = require('cookie-parser');
app.use(cookieParser());
let reloadMagic = require('./reload-magic.js');
let passwords = {};
let sessions = {};

reloadMagic(app);

app.use('/', express.static('build')); // Needed for the HTML and JS files
app.use('/', express.static('public')); // Needed for local assets

let generatedId = () => {
    return "" + Math.floor(Math.random() * 100000000);
}

// Your endpoints go after this line
app.get('/session', (req, res) => {
    let sessionId = req.cookies.sid
    if (typeof sessions[sessionId] === 'undefined') {
        res.send(JSON.stringify({ success: false }));
        return
    }
    res.send(JSON.stringify({ success: true }));
});

app.post("/login", upload.none(), (req, res) => {
    console.log("*** I'm in the login endpoint");
    console.log("this is the parsed body", req.body);
    let username = req.body.username;
    let enteredPassword = req.body.password;
    let expectedPassword = passwords[username];
    console.log("expected password", expectedPassword);
    if (enteredPassword === expectedPassword) {
        console.log("password matches");
        let sessionId = generatedId();
        console.log("generated id", sessionId);
        sessions[sessionId] = username;
        res.cookie('sid', sessionId);
        res.send(JSON.stringify({ success: true }));
        return;
    }
    res.send(JSON.stringify({ success: false }));
});

app.post("/signup", upload.none(), (req, res) => {
    let username = req.body.username;
    let enteredPassword = req.body.password;
    if (typeof passwords[username] !== 'undefined') {
        res.send(JSON.stringify({ success: false, msg: 'New username not available' }));
        return;
    }
    passwords[username] = enteredPassword;
    let sessionId = generatedId();
    sessions[sessionId] = username;
    res.cookie('sid', sessionId);
    res.send(JSON.stringify({ success: true }));
});

app.post("/logout", upload.none(), (req, res) => {
    let sessionId = req.cookies.sid;
    delete sessions[sessionId];
    res.send(JSON.stringify({ success: true }));
})
// Your endpoints go before this line

app.all('/*', (req, res, next) => { // needed for react router
    res.sendFile(__dirname + '/build/index.html');
})


app.listen(4000, '0.0.0.0', () => { console.log("Server running on port 4000") });
