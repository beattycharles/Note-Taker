const express = require('express');
const path = require('path');
const api = require('./routes/index.js');
const app = express();

//MiddleWare
app.use(express.json());
app.use(express.urlencoded({extended: true }));
app.use('/api', api);
app.use(express.static('public'));

//Homepage