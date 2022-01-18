const app = require('express')
// app.use(express.static(__dirname + '/public'));
const routes = app.Router();
const path = require('path');
const multer = require('multer');
const upload = multer({dest: __dirname + '/uploads/images'});
const helpers = require('../../utils/helpers');

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'uploads/');
    },

    // By default, multer removes file extensions so let's add them back
    filename: function(req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});


routes.get("/", (req, res) => {
res.sendFile(path.join(__dirname, "./uploads/images"));
});
  

routes.post('/',(req, res) => {
    let upload = multer({ storage: storage, fileFilter: helpers.imageFilter }).single('profile_pic');

    upload(req, res, function(err) {
        // req.file contains information of uploaded file
        // req.body contains information of text fields, if there were any

        if (req.fileValidationError) {
            return res.send(req.fileValidationError);
        }
        else if (!req.file) {
            return res.send('Please select an image to upload');
        }
        else if (err instanceof multer.MulterError) {
            return res.send(err);
        }
        else if (err) {
            return res.send(err);
        }

        // Display uploaded image for user validation
        res.send(`You have uploaded this image: <hr/><img src="${req.file.path}" width="500"><hr /><a href="./">Upload another image</a>`);
    });
});
// app.post('/path', upload.single('avatar'), function (req, res, next) {
//     // req.file is the `avatar` file
//     // req.body will hold the text fields, if there were any
//   })

module.exports = routes;


// Error: bad content-type header, no content-type
//     at IncomingForm._parseContentType (C:\Users\codyj\OneDrive\Desktop\New folder\devspark\node_modules\formidable\src\Formidable.js:404:9)
//     at IncomingForm.writeHeaders (C:\Users\codyj\OneDrive\Desktop\New folder\devspark\node_modules\formidable\src\Formidable.js:222:10)
//     at IncomingForm.parse (C:\Users\codyj\OneDrive\Desktop\New folder\devspark\node_modules\formidable\src\Formidable.js:188:10)
//   ***  at C:\Users\codyj\OneDrive\Desktop\New folder\devspark\controllers\api\image-routes.js:21:35
//     at Layer.handle [as handle_request] (C:\Users\codyj\OneDrive\Desktop\New folder\devspark\node_modules\express\lib\router\layer.js:95:5)
//     at next (C:\Users\codyj\OneDrive\Desktop\New folder\devspark\node_modules\express\lib\router\route.js:137:13)
//     at Route.dispatch (C:\Users\codyj\OneDrive\Desktop\New folder\devspark\node_modules\express\lib\router\route.js:112:3)
//     at Layer.handle [as handle_request] (C:\Users\codyj\OneDrive\Desktop\New folder\devspark\node_modules\express\lib\router\layer.js:95:5)
//     at C:\Users\codyj\OneDrive\Desktop\New folder\devspark\node_modules\express\lib\router\index.js:281:22
//     at Function.process_params (C:\Users\codyj\OneDrive\Desktop\New folder\devspark\node_modules\express\lib\router\index.js:341:12)