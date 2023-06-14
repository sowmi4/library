require('./config/config');
require('./models/db');
require('./config/passportConfig');
const ProductData = require('./models/Productdata');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');

const rtsIndex = require('./routes/index.router');

var app = express();

// middleware
app.use(bodyParser.json());
app.use(cors());
app.use(passport.initialize());
app.use('/api', rtsIndex);

// error handler
app.use((err, req, res, next) => {
    if (err.name === 'ValidationError') {
        var valErrors = [];
        Object.keys(err.errors).forEach(key => valErrors.push(err.errors[key].message));
        res.status(422).send(valErrors)
    }
    else{
        console.log(err);
    }
});


app.post('/insert',function(req,res){
    res.header("Access-Control-Allow-Origin", "*") //Can access from anywhere
    res.header('Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS');
    console.log(req.body);
    var product = {       
        productId : req.body.product.productId,//product in product.service.ts
        productName : req.body.product.productName,
        productGenre : req.body.product.productGenre,
        productAuthor : req.body.product.productAuthor,
        productPrice : req.body.product.productPrice,
        productImage : req.body.product.productImage
   }       
   var product = new ProductData(product);
   product.save();
});
app.get('/products',function(req,res){
    res.header("Access-Control-Allow-Origin", "*")
    res.header('Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS');
    ProductData.find()
                .then(function(products){
                    res.send(products);
                });
});
// start server
app.listen(process.env.PORT, () => console.log(`Server started at port : ${process.env.PORT}`));