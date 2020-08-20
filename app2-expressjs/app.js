// const http = require('http'); 
const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const app = express();

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

// // app.use is a middleware function.
// // callback passed to app.use will be executed for every matching incoming request.
// // next function will be passed to the callback by express, next is executed to
// // allow the request to travel on to the next middleware. (from top to bottom)
// app.use((req, res, next) => { 
//     console.log('In the middleware');
//     next();  
//     // to next middleware. if we don't pass onto another middleware, we must 
//     // return a response otherwise the request will just die.
// }); 

// by default the incoming request body is not parsed, so need bodyparser
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

// automatically consider the routes in admin.js file, and prepend /admin to all its routes
app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use((req, res, next) => {
    res.status(404).sendFile(path.join(__dirname, 'views', '404.html'));
});

// const server = http.createServer(app);
// server.listen(3000); 
// or just write
app.listen(3000); 