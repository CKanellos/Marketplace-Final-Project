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

class Product {
    constructor(title, location, description, price, imgs) {
        this.title = title;
        this.location = location;
        this.description = description;
        this.price = price;
        this.images = imgs;
    }
}

let products = [
    new Product(
        'Leather Watch',
        'Montreal, Qc',
        `When it comes to classically good-looking timepieces, this leather watch has entered
        the room and raised the bar.`,
        '$89.95',
        ['/products/1.1.png', '/products/1.2.png', '/products/1.3.png']
    ),
    new Product(
        'Wooden Bowls',
        'Laval, Qc',
        `3 wooden bowls`,
        '$34.95',
        ['/products/2.1.png', '/products/2.2.png', '/products/2.3.png']
    ),
    new Product(
        'Grey Sweater',
        'Ottawa, On',
        `A men's Large grey sweater, 100% cotton.`,
        '$59.95',
        ['/products/3.1.png', '/products/3.2.png']
    ),
    new Product(
        'Tortoise Glasses',
        'Montreal, Qc',
        `Women's fashion tortoise glasses, no perscription.`,
        '$29.95',
        ['/products/4.1.png', '/products/4.2.png']
    ),
    new Product(
        'Leather Shoes',
        'Laval, Qc',
        `Men's size 11US leather shoes.`,
        '$129.95',
        ['/products/5.1.png', '/products/5.2.png', '/products/5.3.png']
    )   
];

let generatedId = () => {
    return "" + Math.floor(Math.random() * 100000000);
}

// Your endpoints go after this line
app.get('/session', (req, res) => {
    let sessionId = req.cookies.sid
    if (typeof sessions[sessionId] === 'undefined') {
        res.send(JSON.stringify({ success: false }));
        return;
    }
    res.send(JSON.stringify({ success: true }));
});

app.get('/products', (req, res) => {
    let sessionId = req.cookies.sid;
    if (typeof sessions[sessionId] === 'undefined') {
        res.send(JSON.stringify({ success: false }));
        return;
    }
    res.send(JSON.stringify({ success: true, products: products }));
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
});
// Your endpoints go before this line

app.all('/*', (req, res, next) => { // needed for react router
    res.sendFile(__dirname + '/build/index.html');
});


app.listen(4000, '0.0.0.0', () => { console.log("Server running on port 4000") });
