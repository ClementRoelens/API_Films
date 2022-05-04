const express = require('express');
const router = express.Router();
const filmCtrl = require('../controllers/film');
const multer = require('../middlewares/multer-config');

router.get('/', filmCtrl.tousLesFilms);
router.get('/par_id/:id', filmCtrl.unFilm);
router.get('/par_genre/:genre', filmCtrl.filmsParGenre);
router.get('/par_real/:real',filmCtrl.filmsParReal);
// Route à utiliser si on implémente la recherche par plusieurs genres
// router.get('/par_genres',filmCtrl.filmsParGenre);
router.post('/', multer, filmCtrl.ajouter);
// router.delete('/:id',filmCtrl.supprimer);

module.exports = router;