const express = require('express');
const cors = require('cors');
const modelRoutes = require('./Routes/route');
const path=require('path')

const app = express();

app.use(cors( ));

app.use(express.json());
app.use('/models', express.static(path.join(__dirname, 'temp-uploads')));

app.use( modelRoutes);

module.exports = app;
