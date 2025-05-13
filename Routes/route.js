const express = require('express');
const router = express.Router();
const upload = require('../middlewares/multer');
const { uploadModel, getModels, getModelFile } = require('../controllers/modelcontroller');

router.post('/upload', upload.single('file'), uploadModel);


router.get('/', getModels);


router.get('/:id', getModelFile);



module.exports = router;