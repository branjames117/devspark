const router = require('express').Router();
const { cloudinary, upload } = require('../../config/connection');
//const { upload, uploads } = require('../../config/connection');
//const fs = require('fs');

router.get('/upload', (req, res) => {
  res.render('image');
});

router.post('/upload', upload.single('image'), async (req, res) => {
  try {
    const result = await cloudinary.uploader.upload(req.file.path);
    res.json(result);
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
