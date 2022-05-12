const express = require('express');
const router = express.Router();
const filmCtrl = require('../controllers/film');
const multer = require('../middlewares/multer-config');

router.get('/', filmCtrl.tousLesFilms);
router.get('/un_seul_au_hasard', filmCtrl.unFilmAuHasard);
router.get('/au_hasard', filmCtrl.filmsAuHasard);
router.get('/par_id/:id', filmCtrl.unFilm);
router.get('/par_genre/:genre', filmCtrl.filmsParGenre);
router.get('/par_real/:real', filmCtrl.filmsParReal);
// Route à utiliser si on implémente la recherche par plusieurs genres
// router.get('/par_genres',filmCtrl.filmsParGenre);
router.post('/', multer, filmCtrl.ajouterFilm);
router.post('/like/:id', filmCtrl.ajouterLike);
router.post('/avis/:id', filmCtrl.ajouterAvis);
router.put('/:id', multer, filmCtrl.modifierFilm);
// router.delete('/:id',filmCtrl.supprimer);

module.exports = router;