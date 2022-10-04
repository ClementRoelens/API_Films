const Film = require("../models/film");
// const fs = require("fs");
const config = require("config");
// const genres = config.get("genres");

// Fonction prenant un tableau de films pour en retourner 20 au hasard
const getNfilms = (films) => {
    let transmittedFilm = [];
    // On va créer une nouvelle Array de maximum 20 films pris au hasard (ou moins s'il n'y a pas 20 films)
    for (i = 0, lim = films.length; (i < 20) && (i < lim); i++) {
        const rand = Math.floor(Math.random() * films.length);
        transmittedFilm.push(films[rand]);
        films = films.slice(0, rand).concat(films.slice(rand + 1));
    }
    return transmittedFilm;
};
// Fonction permettant l'affichage de la date et de l'heure
const reqDate = () => {
    const rawDate = new Date();
    const day = rawDate.toLocaleDateString();
    const hour = rawDate.toLocaleTimeString();

    return day + " : " + hour + " - ";
};
// Fonction permettant d'appliquer le bon format aux dates envoyées par MongoDB
const formatDate = (rawFilm) => {
    const formattedFilm = rawFilm.toJSON();
    formattedFilm.date = formattedFilm.date.toLocaleDateString();

    return formattedFilm;
};



//#region Récupérer tous les films


exports.getAllFilms = (req, res, next) => {
    Film.find()
        .then(films => {
            const filmsToSend = films.map(formatDate);
            console.log(reqDate() + "Succès de la récupération de tous les films.Nombre de films récupérés : " + filmsToSend.length);
            res.status(200).json(filmsToSend);
        })
        .catch((error) => {
            console.log(reqDate() + "Erreur dans la récupération de tous les films\n" + error);
            res.status(404).json(error);
        })
};

exports.getAllInOneGenre = (req, res, next) => {
    const seekedGenre = req.params.genre;
    Film.find({ genres: seekedGenre })
        .then(films => {
            const filmsToSend = films.map(formatDate);
            console.log(reqDate() + "Succès de la récupération de tous les films du genre " + seekedGenre + "Nombre de films récupérés : " + filmsToSend.length);
            res.status(200).json(filmsToSend);
        })
        .catch(error => {
            console.log(reqDate() + "Erreur dans la récupération de tous les films du genre " + seekedGenre + "\n" + error);
            res.status(404).json(error);
        });
};

exports.getAllInOneDirector = (req, res, next) => {
    const seekedDirector = req.params.director;
    Film.find({ director: seekedDirector })
        .then(films => {
            const filmsToSend = films.map(formatDate);
            console.log(reqDate() + "Succès de la récupération de tous les films réalisés par " + seekedDirector + "Nombre de films récupérés : " + filmsToSend.length);
            res.status(200).json(filmsToSend);
        })
        .catch(error => {
            console.log(reqDate() + "Erreur dans la récupération de tous les films réalisés par " + seekedDirector + "\n" + error);
            res.status(404).json(error);
        })
};

//#endregion



//#region N Films au hasard

exports.getRandomFilms = (req, res, next) => {
    Film.find()
        .then(films => {
            let filmsToSend = films.map(formatDate);
            const sentFilms = getNfilms(filmsToSend);
            console.log(reqDate() + "Succès de la récupération de 20 films au hasard");
            res.status(200).json(sentFilms);
        })
        .catch((error) => {
            console.log(reqDate() + "Erreur dans la récupération de films au hasard : \n" + error);
            res.status(404).json(error);
        });
};

exports.getRandomInOneGenre = (req, res, next) => {
    console.log("Le genre cherché est " + req.params.genre);
    const seekedGenre = req.params.genre;
    Film.find({ genres: seekedGenre })
        .then(films => {
            const filmsToSend = films.map(formatDate);
            const sentFilms = getNfilms(filmsToSend);
            console.log(reqDate() + "Succès de la récupération de 20 films du genre " + seekedGenre + " au hasard");
            res.status(200).json(sentFilms);
        })
        .catch((error) => {
            console.log(reqDate() + "Erreur dans la récupération de films de " + seekedGenre + " au hasard\n" + error);
            res.status(404).json(error);
        });

};

exports.getRandomInOneDirector = (req, res, next) => {
    const seekedDirector = req.params.director;
    Film.find({ director: seekedDirector })
        .then(films => {
            const filmsToSend = films.map(formatDate);
            const sentFilms = getNfilms(filmsToSend);
            console.log(reqDate() + "Succès de la récupération de 20 films réalisés par " + seekedDirector + " au hasard");
            res.status(200).json(sentFilms);
        })
        .catch((error) => {
            console.log(reqDate() + "Erreur dans la récupération de films de " + seekedDirector + " au hasard\n" + error);
            res.status(404).json(error);
        });
};

exports.getOneRandom = (req, res, next) => {
    Film.find()
        .then(films => {
            const rand = Math.round(Math.random() * (films.length - 1));
            const sentFilm = formatDate(films[rand]);
            console.log(reqDate() + "Succès de la récupération de " + sentFilm.title + " au hasard")
            res.status(200).json(sentFilm);
        })
        .catch((error) => {
            console.log(reqDate() + "Erreur dans la récupération d'un film au hasard\n" + error);
            res.status(404).json(error);
        })
};

// Si on veut rechercher plusieurs genres 
// exports.filmsParGenre = (req, res, next) => {
//     // On va récupérer tous les films appartenant au moins à un des genres passés en URL
//     const genresDeTri = req.query.genre;
//     Film.find()
//         .then(films => {
//             const sentFilms = [];
//             films.forEach(filmAtrier => {
//                 const genresAtrier = filmAtrier.genre;
//                 // Le test est true si au moins un des genres du film itéré est contenu dans l'array des genres cherchés
//                 const test = genresAtrier.some(genre => genresDeTri.includes(genre));
//                 // Si le test est bon, on ajoute ce film à la liste des films qu'on va retourner
//                 if (test){
//                     sentFilms.push(filmAtrier);
//                 }
//             });
//             res.status(200).json(sentFilms);
//         })
//         .catch()

// };

exports.getGenres = (req,res,next) => {
    res.status(200).json(config.get('genres'))
}

//#endregion


exports.getOneFilm = (req, res, next) => {
    console.log("FilmController.getOneFilm lancé");
    console.log("id : "+req.params.id);
    Film.findOne({ _id: req.params.id })
        .then(rawFilm => {
            const sentFilm = formatDate(rawFilm);
            console.log(reqDate() + "Succès de la récupération du film " + sentFilm.title);
            res.status(200).json(sentFilm);
        })
        .catch(error => {
            console.log(reqDate() + "Erreur de la récupération du film\n" + error)
            res.status(404).json(error);
        })
};


//#region Post


exports.addOneFilm = (req, res, next) => {
    console.log("Film controller genres : " + req.body.genres);
    // Les données sont d'abord passés par le validateur et par Multer
    const tempFilm = req.body;
    // Les genres sont espacés par des virgules dans un seul objet string, donc on va en faire une array
    const genresArray = tempFilm.genres.split(",");
    console.log('Film controller : genres :' + genresArray);
    const sentFilm = new Film({
        title: tempFilm.title,
        director: tempFilm.director,
        description: tempFilm.description,
        date: tempFilm.date,
        genres: genresArray,
        // L'URL pouvant varier, on récupérera le domaine de base depuis le front, et on ajoutera juste ça
        imageUrl: "images/" + req.file.filename,
        // On ajoute également les likes, dislikes et avis vierges
        likes: 0,
        dislikes: 0,
        opinionsId: []
    });

    sentFilm.save()
        .then(film => {
            console.log(reqDate() + "Succès de l'ajout de " + sentFilm.title);
            res.status(201).json(formatDate(film));
        })
        .catch(error => {
            console.log(reqDate() + "Erreur dans l'ajout de " + sentFilm.title + "\n" + error)
            res.status(400).json(error);
        });
};

exports.like = (req, res, next) => {
   
};

exports.dislike = (req, res, next) => {
    Film.findOneAndUpdate(
        { _id: req.params.id },
        { dislikes: req.body.dislikes + req.body.operation },
        { new: true }
    ).then(updatedFilm => {
        console.log(reqDate() + "Succès de l'ajout d'un dislike à " + updatedFilm.title + " les portant à " + updatedFilm.dislikes);
        res.status(201).json(formatDate(updatedFilm));
    }).catch(error => {
        console.log(reqDate() + "Erreur dans l'ajout d'un dislike au film d'id " + req.params.id + "\n" + error);
        res.status(400).json(error);
    });
};

//#endregion


// cette requête n'est pas encore utilisée
// exports.supprimer = (req, res, next) => {
//     film.deleteOne({ _id: req.params.id })
//         .then(() => {

//             res.status(200).json({ message: req.params.title + ' supprimé ' })
//         })
//         .catch(error => res.status(400).json({ error }));
// };


// Uniquement pour le développement

exports.fix = (req, res, next) => {
  
};

