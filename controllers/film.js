const Film = require('../models/film');
const fs = require('fs');
const { format } = require('path');


// Certaines requêtes envoient un nombre limité de films. On fixe ce nombre ici
const nombreDeFilms = 20;
// Fonction permettant l'affichage de la date et de l'heure
const reqDate = () => {
    const dateBrute = new Date();
    const jour = dateBrute.toLocaleDateString();
    const heure = dateBrute.toLocaleTimeString();

    return jour + " : " + heure + " - ";
}
// Fonction permettant d'appliquer le bon format aux dates envoyées par MongoDB
const formatDate = (filmBrut) => {
    const filmAuBonFormat = filmBrut.toJSON();
    filmAuBonFormat.date = filmAuBonFormat.date.toLocaleDateString();

    return filmAuBonFormat;
}


//#region Récupérer tous les films


exports.tousLesFilms = (req, res, next) => {
    Film.find()
        .then(films => {
            const filmsAtransmettre = films.map(formatDate);            
            console.log(reqDate() + "Succès de la récupération de tous les films.\nNombre de films récupérés : " + filmsAtransmettre.length + "\n");
            res.status(200).json(filmsAtransmettre);
        })
        .catch((error) => {
            console.log(reqDate() + "Erreur dans la récupération de tous les films\n" + error + "\n");
            res.status(404).json(error);
        })
};

exports.tousLesFilmsParGenre = (req, res, next) => {
    // On va récupérer tous les films appartenant au moins à un des genres passés en URL
    const genreAchercher = req.params.genre;
    Film.find({ genre: genreAchercher })
        .then(films => {
            const filmsAtransmettre = films.map(formatDate);            
            console.log(reqDate() + "Succès de la récupération de tous les films du genre " + genreAchercher + "\nNombre de films récupérés : " + filmsAtransmettre.length + "\n");
            res.status(200).json(filmsAtransmettre);
        })
        .catch(error => {
            console.log(reqDate() + "Erreur dans la récupération de tous les films du genre " + genreAchercher + "\n" + error + "\n");
            res.status(404).json(error);
        });

};

exports.tousLesFilmsParReal = (req, res, next) => {
    const real = req.params.real;
    Film.find({ realisateur: real })
        .then(films => {
            const filmsAtransmettre = films.map(formatDate);            
            console.log(reqDate() + "Succès de la récupération de tous les films réalisés par " + real + "\nNombre de films récupérés : " + filmsAtransmettre.length + "\n");
            res.status(200).json(filmsAtransmettre);
        })
        .catch(error => {
            console.log(reqDate() + "Erreur dans la récupération de tous les films réalisés par " + real + "\n" + error + "\n");
            res.status(404).json(error);
        })
};

//#endregion



//#region N Films au hasard

exports.filmsAuHasard = (req, res, next) => {
    Film.find()
        .then(films => {
            let filmsAtransmettre = films.map(formatDate);            
            const filmsTransmis = [];
            // On va créer une nouvelle Array de N films pris au hasard
            for (i = 0; i < nombreDeFilms && i < filmsAtransmettre.length; i++) {
                const rand = Math.round(Math.random() * (filmsAtransmettre.length - 1));
                filmsTransmis.push(filmsAtransmettre[rand]);
                filmsAtransmettre = filmsAtransmettre.slice(0, rand).concat(filmsAtransmettre.slice(rand + 1));
            }
            console.log(reqDate() + "Succès de la récupération de " + nombreDeFilms + " films au hasard\n");
            res.status(200).json(filmsTransmis);
        })
        .catch((error) => {
            console.log(reqDate() + error + "\n");
            res.status(404).json(error);
        });
};

exports.filmsAuHasardParGenre = (req, res, next) => {
    // On va récupérer tous les films appartenant au moins à un des genres passés en URL
    const genreAchercher = req.params.genre;
    Film.find({ genre: genreAchercher })
        .then(films => {
            const filmsAtransmettre = films.map(formatDate);            
            const filmsTransmis = [];
            // On va créer une nouvelle Array de 25 films pris au hasard
            for (i = 0, limite = filmsAtransmettre.length; (i < 20) && (i < limite); i++) {
                const rand = Math.round(Math.random() * (filmsAtransmettre.length - 1));
                filmsTransmis.push(filmsAtransmettre[rand]);
                filmsAtransmettre = filmsAtransmettre.slice(0, rand).concat(filmsAtransmettre.slice(rand + 1));
            }
            console.log(reqDate() + "Succès de la récupération de " + nombreDeFilms + " films du genre " + genreAchercher + " au hasard\n");
            res.status(200).json(filmsTransmis);
        })
        .catch((error) => {
            console.log(reqDate() + error + "\n");
            res.status(404).json(error);
        });

};

exports.filmsAuHasardParReal = (req, res, next) => {
    const real = req.params.real;
    Film.find({ realisateur: real })
        .then(films => {
            const filmsAtransmettre = films.map(formatDate);            
            const filmsTransmis = [];
            // On va créer une nouvelle Array de 25 films pris au hasard
            for (i = 0, limite = filmsAtransmettre.length; (i < 20) && (i < limite); i++) {
                const rand = Math.round(Math.random() * (filmsAtransmettre.length - 1));
                filmsTransmis.push(filmsAtransmettre[rand]);
                filmsAtransmettre = filmsAtransmettre.slice(0, rand).concat(filmsAtransmettre.slice(rand + 1));
            }
            console.log(reqDate() + "Succès de la récupération de " + nombreDeFilms + " films réalisés par " + real + " au hasard\n");
            res.status(200).json(filmsTransmis);
        })
        .catch((error) => {
            console.log(reqDate() + error + "\n");
            res.status(404).json(error);
        });
};

exports.unFilmAuHasard = (req, res, next) => {
    Film.find()
        .then(films => {
            const rand = Math.round(Math.random() * (films.length - 1));
            const filmTransmis = formatDate(films[rand]);
            console.log(reqDate() + "Succès de la récupération de " + filmTransmis.titre + " au hasard\n")
            res.status(200).json(filmTransmis);
        })
        .catch((error) => {
            console.log(reqDate() + error + "\n");
            res.status(404).json(error);
        })
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

//#endregion


exports.unFilm = (req, res, next) => {
    Film.findOne({ _id: req.params.id })
        .then(filmBrut => {
            const filmTransmis = formatDate(filmBrut);
            console.log(reqDate() + "Succès de la récupération du film " + filmTransmis.titre + "\n");
            res.status(200).json(filmTransmis);
        })
        .catch(error => {
            console.log(reqDate() + "Erreur de la récupération du film " + filmTransmis.titre + "\n" + error + "\n")
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
        .then(film => {
            console.log(reqDate() + "Succès de l'ajout de " + filmTransmis.titre + "\n");
            res.status(201).json(formatDate(film));
        })
        .catch(error => {
            console.log(reqDate() + "Erreur dans l'ajout de " + filmTransmis.titre + "\n" + error + "\n")
            res.status(400).json(error);
        });
};

exports.like = (req, res, next) => {
    Film.findOneAndUpdate(
        { _id: req.params.id },
        { likes: req.body.cancel ? req.body.likes-1 : req.body.likes+1 },
        { new: true }
    ).then(updatedFilm => {
        console.log(reqDate() + "Succès de l'ajout d'un like à " + updatedFilm.titre + " les portant à " + updatedFilm.likes + "\n");
        res.status(201).json(formatDate(updatedFilm));
    }).catch(error => {
        console.log(reqDate() + "Erreur dans l'ajout d'un like au film d'id " + req.params.id + "\n" + error + "\n");
        res.status(400).json(error);
    });
};

exports.dislike = (req,res,next) => {
    Film.findOneAndUpdate(
        { _id: req.params.id },
        { dislikes: req.body.cancel ? req.body.dislikes-1 : req.body.dislikes+1 },
        { new: true }
    ).then(updatedFilm => {
        console.log(reqDate() + "Succès de l'ajout d'un dislike à " + updatedFilm.titre + " les portant à " + updatedFilm.dislikes + "\n");
        res.status(201).json(formatDate(updatedFilm));
    }).catch(error => {
        console.log(reqDate() + "Erreur dans l'ajout d'un dislike au film d'id " + req.params.id + "\n" + error + "\n");
        res.status(400).json(error);
    });
};

exports.ajouterAvis = (req, res, next) => {

};

exports.modifierFilm = (req, res, next) => {
    Film.findOneAndUpdate(
        { _id: req.params.id }, req.body)
        .then(updatedFilm => {
            console.log(reqDate() + "Succès de la de mise à jour du film d'id " + req.params.id + "\n");
            res.status(200).json(formatDate(updatedFilm));
        })
        .catch(error => {
            console.log(reqDate() + "Erreur dans la mise à jour film d'id " + req.params.id + "\n" + error + "\n");
            res.status(400).json(error);
        })
};

// cette requête n'est pas encore utilisée
// exports.supprimer = (req, res, next) => {
//     film.deleteOne({ _id: req.params.id })
//         .then(() => {

//             res.status(200).json({ message: req.params.titre + ' supprimé ' })
//         })
//         .catch(error => res.status(400).json({ error }));
// };


//Test
