const express = require('express');
const cors = require('cors');
const modelRoutes = require('./Routes/route');
const path=require('path')

const app = express();
const allowedOrigins = [
  'https://glb-viewer-ffn8c11g8-anandhu-manojs-projects-2d7d8f6e.vercel.app',
  'https://glb-viewer-673p2p6ds-anandhu-manojs-projects-2d7d8f6e.vercel.app'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
}));

app.use(express.json());
app.use('/models', express.static(path.join(__dirname, 'temp-uploads')));

app.use('/api/models', modelRoutes);

module.exports = app;
