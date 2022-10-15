const express = require("express");
const router = express.Router();
const sharedCtrl = require("../controllers/shared");
const auth = require("../middlewares/authentification");

router.post("/addOneOpinion", auth, sharedCtrl.addOneOpinion);
router.put("/likeOpinion", auth, sharedCtrl.likeOpinion);
router.put("/likeOrDislikeItem", auth, sharedCtrl.likeOrDislikeItem);
router.delete("/eraseOpinion/:opinionId/:filmId/:userId", auth, sharedCtrl.eraseOneOpinion);

// router.put("/fix",sharedCtrl.fix);

module.exports = router;