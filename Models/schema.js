
const mongoose = require('mongoose');

const modelSchema = new mongoose.Schema({
  filename: {
    type: String,
    required: true
  },
  filepath:{
    type:String,
    required:true
  },
  originalName: {
    type: String,
    required: true
  },
  contentType: {
    type: String,
    required: true
  },
  fileType: {
    type: String,
    required: true
  },
  size: {
    type: Number,
    required: true
  },
  uploadDate: {
    type: Date,
    default: Date.now
  },
  metadata: {
    type: Map,
    of: mongoose.Schema.Types.Mixed,
    default: {}
  }
});

const Model3D = mongoose.model('Model3D', modelSchema);

module.exports = Model3D;