const express = require('express')
const bodyParser = require('body-parser')
const multer = require('multer')
const app = express()
// app.use(express.static(__dirname + '/public'));
const path = require('path');

const multerMid = multer({
    storage: multer.memoryStorage(),
    limits: {
      // no larger than 5mb.
      fileSize: 5 * 1024 * 1024,
    },
  })

app.disable('x-powered-by')
app.use(multerMid.single('file'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))
const routes = express.Router();
// const upload = multer({dest: __dirname + '/uploads/images'});
const helpers = require('../../utils/helpers');



// maybe works? Needs more testing
// const storage = multer.diskStorage({
//     destination: function(req, file, cb) {
//         cb(null, 'uploads/');
//     },

//     // By default, multer removes file extensions so let's add them back
//     filename: function(req, file, cb) {
//         cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
//     }
// });


routes.get("/", (req, res) => {
res.sendFile(path.join(__dirname, "./uploads/images"));
});

routes.post('/', async (req, res, next) => {
    try {
      const myFile = req.file
      const imageUrl = await helpers(myFile)
      res
        .status(200)
        .json({
          message: "Upload was successful",
          data: imageUrl
        })
    } catch (error) {
      next(error)
    }
  })
  
  routes.use((err, req, res, next) => {
    res.status(500).json({
      error: err,
      message: 'Internal server error!',
    })
    next()
  })
  
// The below route works up until !req.file
// routes.post('/',(req, res) => {
//     let upload = multer({ storage: storage, fileFilter: helpers.imageFilter }).single('profile_pic');

//     upload(req, res, function(err) {
//         // req.file contains information of uploaded file
//         // req.body contains information of text fields, if there were any

//         if (req.fileValidationError) {
//             return res.send(req.fileValidationError);
//         }
//         else if (!req.file) {
//             return res.send('Please select an image to upload');
//         }
//         else if (err instanceof multer.MulterError) {
//             return res.send(err);
//         }
//         else if (err) {
//             return res.send(err);
//         }

//         // Display uploaded image for user validation
//         res.send(`You have uploaded this image: <hr/><img src="${req.file.path}" width="500"><hr /><a href="./">Upload another image</a>`);
//     });
// });

module.exports = routes;