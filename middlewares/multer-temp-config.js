const multer = require('multer');

const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png'
};

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    console.log("Multer storage temp.destination");
    callback(null, 'images/temp');
  },
  filename: ( req, file, callback) => {
    console.log("Multer storage temp.filename");
    const name = req.body.titre.split(' ').join('_');
    try {
      
      console.log('Entrée dans le Try');
      if (MIME_TYPES[file.mimetype]) {
        const extension = MIME_TYPES[file.mimetype];
        callback(null, name + Date.now() + '.' + extension);
      }
      else {
        // Je n'ai pas trouvé comment envoyer de réponse... En même temps l'utilisateur est censé envoyer une image et est passé par-dessus le front!
        console.log("Mauvais mimetype");
      }
    } catch (error) {
      console.log("Erreur catched");
      console.log(error);
    }
  }
});

module.exports = multer({ storage: storage }).single('file');