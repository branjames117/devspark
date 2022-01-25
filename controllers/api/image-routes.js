const router = require('express').Router();
const { cloudinary, upload } = require('../../config/connection');
const withAuth = require('../../utils/auth');
const User = require('../../models/User');

router.post('/upload', withAuth, upload.single('image'), async (req, res) => {
  // be sure to change below out of comment to allow users to upload picture
  // const result = await cloudinary.uploader.upload(req.file.path);
  const result = {
    url: 'http://res.cloudinary.com/devspark/image/upload/v1642556816/am390ru0diihz9jznnon.png',
  };
  User.update(
    {
      profile_image: result.url,
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
// req.session.user_id
module.exports = router;
