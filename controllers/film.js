const Film = require('../models/film');
const fs = require('fs');

exports.tousLesFilms = (req, res, next) => {
    Film.find()
        .then(films => {
            let filmsAtransmettre = [];
            // Le format de date n'étant pas désiré, on convertit tous les films en JSON pour pouvoir convertir la propriété au format voulu
            films.forEach(film => {
                const tempFilm = film.toJSON();
                tempFilm.date = tempFilm.date.toLocaleDateString();
                filmsAtransmettre.push(tempFilm);
            });
            res.status(200).json(filmsAtransmettre)
        })
        .catch((error) => {
            console.log("erreur : " + error);
            res.status(404).json(error);
        })
};

exports.filmsAuHasard = (req, res, next) => {
    Film.find()
        .then(films => {
            let filmsAtransmettre = [];
            // Le format de date n'étant pas désiré, on convertit tous les films en JSON pour pouvoir convertir la propriété au format voulu
            films.forEach(film => {
                const tempFilm = film.toJSON();
                tempFilm.date = tempFilm.date.toLocaleDateString();
                filmsAtransmettre.push(tempFilm);
            });

            const filmsTransmis = [];
            // On va créer une nouvelle Array de 25 films pris au hasard
            for (i = 0; i < 20 && i < filmsAtransmettre.length; i++) {
                const rand = Math.round(Math.random() * (filmsAtransmettre.length - 1));
                filmsTransmis.push(filmsAtransmettre[rand]);
                filmsAtransmettre = filmsAtransmettre.slice(0, rand).concat(filmsAtransmettre.slice(rand + 1));
            }

            res.status(200).json(filmsTransmis)
        })
        .catch((error) => {
            console.log("erreur : " + error);
            res.status(404).json(error);
        })
};

exports.filmsParGenre = (req, res, next) => {
    // On va récupérer tous les films appartenant au moins à un des genres passés en URL
    const genreAchercher = req.params.genre;
    Film.find()
        .then(films => {
            let filmsAtransmettre = [];
            films.forEach(filmAtrier => {
                const genresAtrier = filmAtrier.genre;
                // Le test est true si au moins un des genres du film itéré est le genre cherché
                if (genresAtrier.includes(genreAchercher)) {
                    // Si le test est bon, on ajoute ce film à la liste des films qu'on va retourner
                    const tempFilm = filmAtrier.toJSON();
                    tempFilm.date = tempFilm.date.toLocaleDateString();
                    filmsAtransmettre.push(tempFilm);
                }
            });

            const filmsTransmis = [];
            // On va créer une nouvelle Array de 25 films pris au hasard
            for (i = 0, limite = filmsAtransmettre.length; (i < 20) && (i < limite); i++) {
                const rand = Math.round(Math.random() * (filmsAtransmettre.length - 1));
                filmsTransmis.push(filmsAtransmettre[rand]);
                filmsAtransmettre = filmsAtransmettre.slice(0, rand).concat(filmsAtransmettre.slice(rand + 1));
            }
            res.status(200).json(filmsTransmis);
        })
        .catch(error => res.status(404).json(error))

};

// Si on veut rechercher plusieurs genres 
// exports.filmsParGenre = (req, res, next) => {
//     // On va récupérer tous les films appartenant au moins à un des genres passés en URL
//     const genresDeTri = req.query.genre;
//     Film.find()
//         .then(films => {
//             const filmsTransmis = [];
//             films.forEach(filmAtrier => {
//                 const genresAtrier = filmAtrier.genre;
//                 // Le test est true si au moins un des genres du film itéré est contenu dans l'array des genres cherchés
//                 const test = genresAtrier.some(genre => genresDeTri.includes(genre));
//                 // Si le test est bon, on ajoute ce film à la liste des films qu'on va retourner
//                 if (test){
//                     filmsTransmis.push(filmAtrier);
//                 }
//             });
//             res.status(200).json(filmsTransmis);
//         })
//         .catch()

// };

exports.filmsParReal = (req, res, next) => {
    const real = req.params.real;
    Film.find()
        .then(films => {
            let filmsAtransmettre = [];
            films.forEach(filmAtrier => {
                if (filmAtrier.realisateur === real) {
                    // Si le test est bon, on ajoute ce film à la liste des films qu'on va retourner
                    const tempFilm = filmAtrier.toJSON();
                    tempFilm.date = tempFilm.date.toLocaleDateString();
                    filmsAtransmettre.push(tempFilm);
                }
            });
            const filmsTransmis = [];
            // On va créer une nouvelle Array de 25 films pris au hasard
            for (i = 0, limite = filmsAtransmettre.length; (i < 20) && (i < limite); i++) {
                const rand = Math.round(Math.random() * (filmsAtransmettre.length - 1));
                filmsTransmis.push(filmsAtransmettre[rand]);
                filmsAtransmettre = filmsAtransmettre.slice(0, rand).concat(filmsAtransmettre.slice(rand + 1));
            }
            res.status(200).json(filmsTransmis);
        })
        .catch(error => res.status(404).json(error))
};

exports.unFilm = (req, res, next) => {
    Film.findOne({ _id: req.params.id })
        .then(filmBrut => {
            // Le format de date n'étant pas désiré, on convertit l'objet en JSON pour pouvoir convertir la propriété au format voulu
            const filmTransmis = filmBrut.toJSON();
            filmTransmis.date = filmTransmis.date.toLocaleDateString();
            res.status(200).json(filmTransmis);
        })
        .catch(error => res.status(404).json(error))
};

exports.unFilmAuHasard = (req,res,next)=>{
    Film.find()
        .then(films => {
            const rand = Math.round(Math.random()*(films.length-1));
            const filmTransmis = films[rand].toJSON();
            filmTransmis.date = filmTransmis.date.toLocaleDateString();
            res.status(200).json(filmTransmis);
        })
        .catch((error) => {
            console.log("erreur : " + error);
            res.status(404).json(error);
        })
};

exports.ajouterFilm = (req, res, next) => {
    // L'image est passée par Multer et a été enregistrée dans le serveur
    // On recompose l'objet car les genres sont passés en String et on les veut en Array
    
    const tempFilm = req.body;
    const filmTransmis = new Film({
        titre: tempFilm.titre,
        realisateur: tempFilm.realisateur,
        description: tempFilm.description,
        date: tempFilm.date,
        genre: tempFilm.genres.split(','),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        likes: 0,
        dislikes: 0
    });

    filmTransmis.save()
        .then(() => res.status(201).json({ message: film.titre + ' correctement ajouté' }))
        .catch(error => res.status(400).json({ error }))
};

exports.ajouterLike = (req, res, next) => {
    // On cherche d'abord le film liké pour récupérer ses données
    Film.findOne({ _id: req.params.id })
        .then(film => {
            // Si le film n'a pas encore de like,
            const updatedLikes = film.likes ? ++film.likes : 1;
            Film.updateOne(
                { _id: req.params.id },
                {
                    titre: film.titre,
                    realisateur: film.realisateur,
                    description: film.description,
                    date: film.date,
                    genre: film.genre,
                    imageUrl: film.imageUrl,
                    likes: updatedLikes,
                    avis: film.avis
                })
                .then(() => {
                    Film.findOne({ _id: req.params.id })
                        .then(filmBrut => {
                            // Le format de date n'étant pas désiré, on convertit l'objet en JSON pour pouvoir convertir la propriété au format voulu
                            const filmTransmis = filmBrut.toJSON();
                            filmTransmis.date = filmTransmis.date.toLocaleDateString();
                            res.status(200).json(filmTransmis);
                        })
                        .catch(error => res.status(404).json(error))
                }).catch(error => res.status(400).json({ error }));
        })
        .catch(error => res.status(400).json({ error }));

};

exports.ajouterAvis = (req, res, next) => {

};

exports.modifierFilm = (req, res, next) => {
    Film.findOne({_id : req.params.id})
    .then(film=>{
        const tempFilm = req.body;
        const filmTransmis = new Film({
            _id:req.params.id,
            titre: tempFilm.titre ? tempFilm.titre : film.titre,
            realisateur: tempFilm.realisateur ? tempFilm.realisateur : film.realisateur,
            description: tempFilm.description ? tempFilm.description : film.description,
            date: tempFilm.date ? tempFilm.date : film.date,
            genre: tempFilm.genres ? tempFilm.genres.split(',') : film.genres,
            imageUrl: req.file ? `${req.protocol}://${req.get('host')}/images/${req.file.filename}` : film.imageUrl,
            likes: tempFilm.likes ? tempFilm.likes : 0,
            dislikes: tempFilm.dislikes ? tempFilm.dislikes : 0
        });
        Film.updateOne(
            { _id: req.params.id }, filmTransmis)
            .then(() => {
                res.status(200).json({ message: 'bien' })
        })
            .catch(error => {
                console.log(error)
                res.status(400).json(error)
            })
    })
    .catch(error=>res.status(404).json(error,{message:"Le film à modifier n'as pas été trouvé"}));
    
};

// cette requête n'est pas encore utilisée
// exports.supprimer = (req, res, next) => {
//     film.deleteOne({ _id: req.params.id })
//         .then(() => {

//             res.status(200).json({ message: req.params.titre + ' supprimé ' })
//         })
//         .catch(error => res.status(400).json({ error }));
// };
