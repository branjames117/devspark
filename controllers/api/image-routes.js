const router = require('express').Router();
const formidable = require('formidable');
const options = {
    filter: function ({name, originalFilename, mimetype}) {
      // keep only images
      return mimetype && mimetype.includes("image");
    }
  };


// app.get('/image', (req, res) => {
//     res.send(`
//     <form method="POST" action="/image-upload" enctype="multipart/form-data">
//     <input type="file" name="img" />
//     <input type="submit" />
//   </form>
//     `);
//   });
  
  router.post('/upload', (req, res) => {
    new formidable.IncomingForm().parse(req)
    .on('field', (name, field) => {
        console.log('Field', name, field)
      })
      .on('fileBegin', (name, file)=>{
          file.path = __dirname + '/uploads' + file.name
      })
      .on('file', (name, file) => {
        console.log('Uploaded file', name, file)
      })
      .on('aborted', () => {
        console.error('Request aborted by the user')
      })
      .on('error', (err) => {
        console.error('Error', err)
        throw err
      })
      .on('end', () => {
        res.end()
      })
})

module.exports = router;