const express = require('express');
const app = express();
const port = 3000;

app.set('view engine','ejs');

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.render('index')
});

app.get('/cart', (req, res) => {
    res.render('cart')
});
app.get('/add-product', (req, res) => {
    res.render('add-product')
});
app.get('/checkout', (req, res) => {
    res.render('checkout')
});
app.get('/complain', (req, res) => {
    res.render('footer-complain')
});
app.get('/contact', (req, res) => {
    res.render('footer-contact')
});
app.get('/privacy', (req, res) => {
    res.render('footer-privacy')
});
app.get('/property', (req, res) => {
    res.render('footer-property')
});
app.get('/kid', (req, res) => {
    res.render('kid-bags')
});
app.get('/login', (req, res) => {
    res.render('login')
});

app.get('/men', (req, res) => {
    res.render('men-t-shirts')
});

app.get('/product-details', (req, res) => {
    res.render('product-details')
});

app.get('/register', (req, res) => {
    res.render('register_cus')
});
app.get('/register-ship', (req, res) => {
    res.render('register_ship')
});
app.get('/register-ven', (req, res) => {
    res.render('register_ven')
});
app.get('/shipper', (req, res) => {
    res.render('shipper-page')
});
app.get('/vendor', (req, res) => {
    res.render('vendor-page')
});
app.get('/women', (req, res) => {
    res.render('women-sweaters')
});


app.listen(port, () => {
    console.log(`Server listening on http://localhost:3000/`)
});