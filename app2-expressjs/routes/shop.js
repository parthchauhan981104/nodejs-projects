const path = require('path');

const express = require('express'); 

const rootDir = require('../util/path');

//this Router is like a mini express app pluggable into the other app
const router = express.Router();

// the path argument means it should 'start' with that. example '/' will also work 
// for routes like '/product' , so we must write these before and not use next() in them.
router.get('/', (req, res, next) => { 
    res.sendFile(path.join(rootDir, 'views', 'shop.html')); 
    // path.join detects OS and builds path accordingly
    //__dirname gives path to folder in which it is used
});

module.exports = router;
