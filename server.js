let express = require('express');
let multer = require("multer");
let upload = multer({ dest: __dirname + '/uploads/' });
let app = express();
let cookieParser = require('cookie-parser');
app.use(cookieParser());
let reloadMagic = require('./reload-magic.js');
let passwords = {};
let sessions = {};
let carts = {};

reloadMagic(app);

app.use('/', express.static('build')); // Needed for the HTML and JS files
app.use('/', express.static('public')); // Needed for local assets
app.use('/uploaded', express.static(__dirname + '/uploads'));

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
        189.95,
        ['/products/1.1.png', '/products/1.2.png', '/products/1.3.png']
    ),
    new Product(
        '3 Wooden Bowls',
        'Laval, Qc',
        `Beautiful to use as a centerpiece, these bowls are also ideal for serving salads and fruits. 
        Elegantly designed and made from durable acacia wood, it will make a lovely addition to both 
        modern and traditional table settings.`,
        34.95,
        ['/products/2.1.png', '/products/2.2.png', '/products/2.3.png']
    ),
    new Product(
        'Grey Sweater Size Medium',
        'Ottawa, On',
        `A men's Large grey sweater, 100% cotton.`,
        89.95,
        ['/products/3.1.png', '/products/3.2.png']
    ),
    new Product(
        'Tortoise Glasses',
        'Montreal, Qc',
        `From sunrise to sunset, keep up with your active life while earning major style points. 
        We dreamed up this ultra-lightweight design to deliver all-day comfort and  complement a 
        variety of face shapes.`,
        164.95,
        ['/products/4.1.png', '/products/4.2.png']
    ),
    new Product(
        'Leather Shoes Size 11US',
        'Laval, Qc',
        `Men's size 11US leather shoes.`,
        179.95,
        ['/products/5.1.png', '/products/5.2.png', '/products/5.3.png']
    ),
    new Product(
        '3 Cacti',
        'Laval, Qc',
        'Small assorted cacti garden in pretty decorative 6" pot.',
        39.95,
        ['/products/6.1.png', '/products/6.2.png']
    ),
    new Product(
        'Black Lamp',
        'Laval, Qc',
        `Smooth curved lines come together to form this contemporary table lamp. This 
        piece has an inherent elegance that only grows when lit. When set within the modern 
        bedroom it becomes a radiant focal point from dusk to dawn.`,
        44.95,
        ['/products/7.png']
    ),
    new Product(
        'Eau De Costa',
        'Montreal, Qc',
        `Inspired by London's Covent Garden early morning market, this fragrance combines 
        succulent notes of nectarine, peach, and cassis with delicate spring flowers that 
        melt into a note of acacia honey. The result is a sweet and delightfully playful 
        fragrance. `,
        74.95,
        ['/products/8.png']
    ),
    new Product(
        'Backpack',
        'Montreal, Qc',
        `This large backpack is perfect for anyone on the go, especially the students! It 
        can double down as an extra large laptop backpack as it has enough room to carry 
        your laptop along with your books.`,
        29.95,
        ['/products/9.1.png', '/products/9.2.png']
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

app.get('/cartdata', (req, res) => {
    let sessionId = req.cookies.sid;
    if (typeof sessions[sessionId] === 'undefined') {
        res.send(JSON.stringify({ success: false }));
        return;
    }
    let username = sessions[sessionId];
    let cartItems = typeof carts[username] !== 'undefined' ? carts[username] : [];
    res.send(JSON.stringify({ success: true, products: products, cartItems: cartItems }));
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

app.post("/addtocart", upload.none(), (req, res) => {
    let sessionId = req.cookies.sid;
    if (typeof sessions[sessionId] === 'undefined') {
        res.send(JSON.stringify({ success: false }));
        return;
    }
    let username = sessions[sessionId];
    let itemId = Number(req.body.itemId);
    if (typeof carts[username] === 'undefined') {
        carts[username] = [];
    }
    carts[username].push(itemId);
    res.send(JSON.stringify({ success: true, cartItems: carts[username] }));
});

app.post("/addProduct", upload.single('image'), (req, res) => {
    let sessionId = req.cookies.sid;
    if (typeof sessions[sessionId] === 'undefined') {
        res.send(JSON.stringify({ success: false }));
        return;
    }
    let file = req.file;
    let frontendPaths = (typeof file !== 'undefined') ? ['/uploaded/' + file.filename] : [];
    let newProduct = new Product(
        req.body.title,
        req.body.location,
        req.body.description,
        Number(req.body.price),
        frontendPaths
    );
    products.push(newProduct);
    res.send(JSON.stringify({ success: true, products: products }));
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
