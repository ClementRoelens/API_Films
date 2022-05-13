const express = require('express');
const router = express.Router();
const filmCtrl = require('../controllers/film');
const multer = require('../middlewares/multer-config');

// Les get
// Renvoie la totalité
router.get('/', filmCtrl.tousLesFilms);
router.get('/par_genre/:genre', filmCtrl.tousLesFilmsParGenre);
router.get('/par_real/:real', filmCtrl.tousLesFilmsParReal);
// Renvoie un certain nombre au hasard
router.get('/au_hasard', filmCtrl.filmsAuHasard);
router.get('/au_hasard_par_genre/:genre',filmCtrl.filmsAuHasardParGenre);
router.get('/au_hasard_par_real/:real',filmCtrl.filmsAuHasardParReal);
router.get('/un_seul_au_hasard', filmCtrl.unFilmAuHasard);
// Renvoie un seul film choisi
router.get('/par_id/:id', filmCtrl.unFilm);

// Les autres
router.post('/', multer, filmCtrl.ajouterFilm);
router.post('/like/:id', filmCtrl.like);
router.post('/dislike/:id', filmCtrl.dislike);
router.post('/avis/:id', filmCtrl.ajouterAvis);

router.put('/:id', multer, filmCtrl.modifierFilm);

// router.delete('/:id',filmCtrl.supprimer);

module.exports = router;