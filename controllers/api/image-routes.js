const app = require('express')
const router = app.Router();

const multer = require('multer');
const upload = multer({dest: __dirname + '/uploads/images'});

// const formidable = require('formidable');
// const options = {
//     filter: function ({name, originalFilename, mimetype}) {
//       // keep only images
//       return mimetype && mimetype.includes("image");
//     }
//   };


router.get('/image', (req, res) => {
    res.render('img');
  });
  
//   router.post('/upload', (req, res) => {
//     new formidable.IncomingForm(options).parse(req)
//     .on('field', (name, field) => {
//         console.log('Field', name, field)
//       })
//       .on('fileBegin', (name, file)=>{
//           file.path = __dirname + '/uploads' + file.name
//       })
//       .on('file', (name, file) => {
//         console.log('Uploaded file', name, file)
//       })
//       .on('aborted', () => {
//         console.error('Request aborted by the user')
//       })
//       .on('error', (err) => {
//         console.error('Error', err)
//         throw err
//       })
//       .on('end', () => {
//         res.end()
//       })
// })

router.post('/upload', upload.single('photo'), (req, res) => {
    if(req.file) {
        res.json(req.file);
    }
    else throw 'error';
});
// app.post('/path', upload.single('avatar'), function (req, res, next) {
//     // req.file is the `avatar` file
//     // req.body will hold the text fields, if there were any
//   })

module.exports = router;


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