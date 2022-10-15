const User = require('../models/user');
// Pour le moment, cet import sert seulement pour des vérifications pendant le développement
const Film = require('../models/film');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const opinion = require('../models/opinion');

exports.signup = (req, res, next) => {
    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            const user = new User({
                nickname: req.body.nickname,
                password: hash,
                isAdmin: false
            });
            user.save()
                .then(() => {
                    res.status(201).json({ message: 'Utilisateur créé!' })
                })
                .catch(error => res.status(400).json(error));
        })
        .catch(error => res.status(500).json(error));
};

exports.signin = (req, res, next) => {
    console.log("Tentative de connexion");
    // On cherche l'utilisateur
    User.findOne({ nickname: req.body.nickname })
        .then(user => {
            if (user) {
                // Une fois trouvé, on compare son password crypté à ce qu'il y a dans la DB
                bcrypt.compare(req.body.password, user.password)
                    .then(result => {
                        if (result) {
                            // Si le résultat est positif, alors on renvoie les infos de l'utilisateur
                            console.log("Connexion réussie de " + user.nickname);
                            res.status(200).json({
                                _id: user.id,
                                nickname: user.nickname,
                                isAdmin: user.isAdmin,
                                likedFilmsId: user.likedFilmsId,
                                dislikedFilmsId: user.dislikedFilmsId,
                                opinionsId: user.opinionsId,
                                likedOpinionsId: user.likedOpinionsId,
                                // Et le JWT
                                token: jwt.sign(
                                    { userId: user.id },
                                    'RANDOM_TOKEN_SECRET'
                                    // { expiresIn: 120 }
                                )
                            })
                        }
                        else {
                            console.log("Connexion échouée : mot de passe incorrecte");
                            res.status(401).json("Mot de passe incorrect");
                        }
                    })
                    .catch(error => {
                        console.log("Connexion échouée");
                        console.log(error);
                        res.status(500).json(error);
                    });
            }
            else {
                console.log("Connexion échouée, utilisateur non-trouvé");
                res.status(404).json({ error: "Utilisateur non-trouvé" });
            }
        })
        .catch(error => res.status(500).json(error));
};

exports.getOneUser = (req, res, next) => {
    User.findOne({ _id: req.params.id })
        .then(user => {
            const sendUser = {
                _id: user._id,
                nickname: user.nickname,
                likedFilmsId: user.likedFilmsId,
                dislikedFilmsId: user.dislikedFilmsId,
                opinionsId: user.opinionsId,
                likedOpinionsId: user.likedOpinionsId,
                isAdmin: user.isAdmin
            };
            res.status(200).json(sendUser);
        })
        .catch(error => {
            console.log(error);
            res.status(404).json(error);
        });
};


// Utilisée seulement pendant le développement
exports.getLikedFilms = (req, res, next) => {
    let filmsList = [];
    User.findOne({ _id: req.params.id })
        .then(user => {
            const limit = user.likedFilmsId.length;
            let i = 0;
            user.likedFilmsId.forEach(filmId => {
                Film.findOne({ _id: filmId })
                    .then(film => {
                        i++;
                        filmsList.push(film.titre);
                        if (i == limit) {
                            res.status(200).json({ list: filmsList });
                        }
                    })
            });
        })
};

exports.getDislikedFilms = (req, res, next) => {
    let filmsList = [];
    User.findOne({ _id: req.params.id })
        .then(user => {
            const limit = user.dislikedFilmsId.length;
            let i = 0;
            user.dislikedFilmsId.forEach(filmId => {
                Film.findOne({ _id: filmId })
                    .then(film => {
                        i++;
                        filmsList.push(film.titre);
                        if (i == limit) {
                            res.status(200).json({ list: filmsList });
                        }
                    })
            });
        })
};

exports.getOpinions = (req, res, next) => {
    console.log("Entrée dans userController.getNoticedFilms");
    let filmsList = [];
    User.findOne({ _id: req.params.id })
        .then(user => {
            const limit = user.noticesFilmsId.length;
            if (limit > 0) {
                let i = 0;
                user.noticesFilmsId.forEach(filmId => {
                    Film.findOne({ _id: filmId })
                        .then(film => {
                            i++;
                            filmsList.push(film.titre);
                            if (i == limit) {
                                res.status(200).json({ list: filmsList });
                            }
                        })
                });
            }
            else {
                res.status(200).json("Cet utilisateur n'a donné aucun avis");
            }
        })
};

exports.fix = (req, res, next) => {

}

exports.getAllUsers = (req, res, next) => {
    User.find().then(users => res.status(200).json(users))
}

