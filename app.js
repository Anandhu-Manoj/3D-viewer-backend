const express = require('express');
const cors = require('cors');
const modelRoutes = require('./Routes/route');
const path=require('path')

const app = express();
app.use(cors({origin: 'https://glb-viewer-ffn8c11g8-anandhu-manojs-projects-2d7d8f6e.vercel.app'}));
app.use(express.json());
app.use('/models', express.static(path.join(__dirname, 'temp-uploads')));

app.use('/api/models', modelRoutes);

module.exports = app;
