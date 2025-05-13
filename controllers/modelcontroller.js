const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const Model3D=require('../Models/schema')

const getContentType = (filename) => {
  const contentTypeMap = {
    'obj': 'model/obj',
    'fbx': 'application/octet-stream',
    'glb': 'model/gltf-binary',
    'gltf': 'model/gltf+json',
    'stl': 'model/stl',
    'dae': 'model/vnd.collada+xml',
    '3ds': 'application/x-3ds',
    'blend': 'application/octet-stream'
  };
  
  const extension = filename.split('.').pop().toLowerCase();
  return contentTypeMap[extension] || 'application/octet-stream';
};

exports.uploadModel = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const tempFilePath = req.file.path;  
    const originalName = req.file.originalname;
    const fileType = path.extname(originalName).substring(1).toLowerCase();
    const contentType = getContentType(originalName);
    const fileSize = req.file.size;

    if (!tempFilePath) {
      return res.status(400).json({ error: 'File path is missing' });
    }

    const newModel = new Model3D({
      filename: originalName,
      originalName: originalName,
      filepath: tempFilePath,  
      contentType: contentType,
      fileType: fileType,
      size: fileSize,
      metadata: {
        uploadDate: new Date()
      }
    });

    await newModel.save();


    res.status(201).json({
      file: {
        filename: originalName,
        contentType: contentType,
        fileType: fileType,
        size: fileSize
      },
      message: '3D model uploaded successfully'
    });
  } catch (error) {
    console.error('Error during file upload:', error);

    if (req.file && req.file.path) {
      fs.unlink(req.file.path, (err) => {
        if (err) console.error('Error deleting temp file:', err);
      });
    }

    res.status(500).json({ error: 'File upload failed', details: error.message });
  }
};


exports.getModels = async (req, res) => {
  try {
    const models = await Model3D.find().sort({ uploadDate: -1 });
    
    if (!models || models.length === 0) {
      return res.status(404).json({ message: 'No models found' });
    }
    
    res.json(models);
  } catch (error) {
    console.error('Error fetching models:', error);
    res.status(500).json({ error: 'Failed to retrieve models', details: error.message });
  }
};




exports.getModelFile = async (req, res) => {
  try {
    const model = await Model3D.findOne({
      $or: [
        { _id: mongoose.isValidObjectId(req.params.id) ? req.params.id : null },
        { filename: req.params.id }
      ]
    });

    if (!model) {
      return res.status(404).json({ message: 'Model not found' });
    }


    const modelFilePath = path.resolve(model.filepath);
    
    if (!fs.existsSync(modelFilePath)) {
      return res.status(404).json({ message: 'Model file not found on server' });
    }
    res.setHeader('Content-Type', model.contentType);

    fs.createReadStream(modelFilePath).pipe(res);

  } catch (error) {
    console.error('Error retrieving file:', error);
    res.status(500).json({ error: 'Failed to retrieve file', details: error.message });
  }
};



