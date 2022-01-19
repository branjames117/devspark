const router = require('express').Router();
const { cloudinary, upload } = require('../../config/connection');
const withAuth = require('../../utils/withAuth');

// GET /api/images/upload
router.get('/upload', (req, res) => {
  res.render('image');
});

// POST /api/images/upload
router.post('/upload', withAuth, upload.single('image'), async (req, res) => {
  try {
    // const result = await cloudinary.uploader.upload(req.file.path);
    const result = {
      url: 'https://res.cloudinary.com/devspark/image/upload/v1642554695/ntaqdh81u62rejpv2pfz.jpg',
    };
    res.json(result.url);
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
