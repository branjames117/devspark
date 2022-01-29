const router = require('express').Router();
const { cloudinary, upload } = require('../../config/connection');
const withAuth = require('../../utils/auth');
const User = require('../../models/User');

router.post('/upload', withAuth, upload.single('image'), async (req, res) => {
  const id = req.session.user_id;

  try {
    if (req.invalidFile) {
      return res.redirect('/profile/editor');
    }

    const user = await User.findByPk(id, { raw: true });

    // if user already uploaded an image to their profile...
    if (user.profile_image_id) {
      // then delete their previous image from our cloudinary store
      await cloudinary.uploader.destroy(user.profile_image_id);
    }

    // upload their new image, extracting url and public_id from the returned object
    const { url, public_id } = await cloudinary.uploader.upload(req.file.path);

    await User.update(
      {
        profile_image: url,
        profile_image_id: public_id,
      },
      {
        where: {
          id,
        },
      }
    );

    res.redirect(`/profile/${id}`);
  } catch (error) {
    console.log(error);
    console.log({
      message: 'Something went wrong with your image upload.',
      error,
    });
    res.status(500).json({
      message: 'Something went wrong with your image upload.',
      error,
    });
  }
});

module.exports = router;
