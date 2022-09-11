const express = require("express");
const router = express.Router();
const sharedCtrl = require("../controllers/shared");
const auth = require("../middlewares/authentification");

router.post("/addOneOpinion", auth, sharedCtrl.addOneOpinion);
router.put("/likeOpinion", auth, sharedCtrl.likeOpinion);
router.put("/likeOrDislikeFilm", auth, sharedCtrl.likeOrDislikeFilm);
router.delete("/eraseOpinion/:opinionId/:filmId/:userId", auth, sharedCtrl.eraseOneOpinion);

module.exports = router;