const router = require('express').Router();
const { cloudinary, upload } = require('../../config/connection');
const withAuth = require('../../utils/auth');
const User = require('../../models/User');

router.post('/upload', withAuth, upload.single('image'), async (req, res) => {
  // grab the user
  const user = await User.findByPk(req.session.user_id, { raw: true });

  // if user already uploaded an image to their profile...
  if (user.profile_image_id) {
    // then delete their previous image from our cloudinary account
    await cloudinary.uploader.destroy(user.profile_image_id);
  }

  // upload their image, extracting url and public_id from the returned object
  const { url, public_id } = await cloudinary.uploader.upload(req.file.path);

  User.update(
    {
      profile_image: url,
      profile_image_id: public_id,
    },
    {
      where: {
        id: req.session.user_id,
      },
    }
  )
    .then((data) => {
      if (!data) {
        res.status(404).json({
          message:
            'We could not update your Profile Picture, please try again or use a smaller image',
        });
        return;
      } else {
        res.redirect(`/profile/${req.session.user_id}`);
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

module.exports = router;
