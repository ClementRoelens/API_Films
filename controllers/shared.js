const User = require("../models/user");
const Opinion = require("../models/opinion");
const Film = require("../models/film");
// const { json } = require("express/lib/response");

exports.addOneOpinion = (req, res, next) => {
    console.log("Entrée dans sharedController.createOpinion");
    console.log("userId : " + req.body.userId);
    console.log("filmId : " + req.body.filmId);
    console.log("content : " + req.body.content);

    const newOpinion = new Opinion({
        content: req.body.content,
        likes: 0,
        author: req.body.userId
    });
    newOpinion.save()
        .then(opinion => {
            console.log("Avis créé. On va mainenant ajouter la référence dans le film et l'user impliqués");
            console.log("filmId : " + req.body.filmId);
            Film.findOne({ _id: req.body.filmId })
                .then(film => {
                    console.log("Film trouvé : " + film);
                    let newOpinionsId = film.opinionsId;
                    console.log("newOpinionsId : " + newOpinionsId);
                    newOpinionsId.push(opinion._id);
                    Film.findOneAndUpdate(
                        { _id: film._id },
                        { opinionsId: newOpinionsId },
                        { new: true })
                        .then(updatedFilm => {
                            console.log("Film mis à jour. On va maintenant mettre à jour l'user");
                            User.findOne({ _id: req.body.userId })
                                .then(user => {
                                    console.log("Utilisateur trouvé");
                                    let newOpinionsId = user.opinionsId;
                                    newOpinionsId.push(opinion._id);
                                    User.findOneAndUpdate(
                                        { _id: user._id },
                                        { opinionsId: newOpinionsId },
                                        { new: true })
                                        .then(updatedUser => {
                                            console.log("User mise à jour");
                                            res.status(201).json({
                                                opinion: opinion,
                                                film: updatedFilm,
                                                user: updatedUser
                                            });
                                        })
                                        .catch(error => {
                                            console.log("Erreur lors de la mise à jour de l'user");
                                            res.status(400).json({ Erreur: error });
                                        });
                                })
                                .catch(error => {
                                    console.log("Erreur lors de la récupération de l'user : " + error);
                                    res.status(404).json({ Erreur: error });
                                });
                        })
                        .catch(error => {
                            console.log("Erreur lors de la modification du film : " + error);
                            res.status(400).json({ Erreur: error });
                        });
                })
                .catch(error => {
                    console.log("Erreur lors de la récupération du film : " + error);
                    res.status(404).json({ Erreur: error });
                });
        })
        .catch(error => {
            console.log("Erreur lors de la création de l'avis : " + error);
            res.status(400).json({ Erreur: error });
        });
};

exports.eraseOneOpinion = (req, res, next) => {
    console.log("Entrée dans sharedController.eraseOpinion");
    Opinion.deleteOne({ _id: req.params.opinionId })
        .then(() => {
            Film.findOne({ _id: req.params.filmId })
                .then(film => {
                    const index = film.opinionsId.indexOf(req.params.opinionId);
                    let newOpinionsId = film.opinionsId;
                    newOpinionsId.splice(index, 1);
                    Film.findOneAndUpdate(
                        { _id: req.params.filmId },
                        { opinionsId: newOpinionsId },
                        { new: true })
                        .then(updatedFilm => {
                            User.findOne({ _id: req.params.userId })
                                .then(user => {
                                    const index2 = user.opinionsId.indexOf(req.params.opinionId);
                                    let newOpinionsId2 = user.opinionsId;
                                    newOpinionsId2.splice(index2, 1);
                                    User.findOneAndUpdate(
                                        { _id: req.params.userId },
                                        { opinionsId: newOpinionsId2 },
                                        { new: true })
                                        .then(updatedUser => {
                                            res.status(200).json({
                                                user: updatedUser,
                                                film: updatedFilm
                                            });
                                        })
                                        .catch(error => {
                                            console.log("Erreur lors de la modification de l'user");
                                            res.status(400).json({
                                                message: "Erreur lors de la modification de l'user",
                                                erreur: error
                                            });
                                        })
                                })
                                .catch(error => {
                                    console.log("Erreur lors de la récupération de l'user");
                                    res.status(404).json({
                                        message: "Erreur lors de la récupération de l'user",
                                        erreur: error
                                    });
                                });
                        })
                        .catch(error => {
                            console.log("Erreur lors de la modification du film");
                            res.status(400).json({
                                message: "Erreur lors de la modification du film",
                                erreur: error
                            });
                        });
                })
                .catch(error => {
                    console.log("Erreur lors de la récupération du film");
                    res.status(404).json({
                        message: "Erreur lors de la récupération du film",
                        erreur: error
                    });
                });
        })
        .catch(error => {
            console.log("Erreur lors de la suppression de l'avis");
            res.status(400).json({
                message: "Erreur lors de la suppression de l'avis",
                erreur: error
            });
        });
};

exports.likeOpinion = (req, res, next) => {
    console.log("Entrée dans sharedController.likeOpinion");
    User.findOne({ _id: req.body.userId })
        .then(user => {
            let newLikedOpinionsId = user.likedOpinionsId;
            console.log("opinionId : " + req.body.opinionId);
            console.log("likedOpinionsId initiales : " + newLikedOpinionsId);
            let operation = 0;
            if (user.likedOpinionsId.includes(req.body.opinionId)) {
                operation = -1;
                const index = newLikedOpinionsId.indexOf(req.body.opinionId);
                newLikedOpinionsId.splice(index, 1);
            }
            else {
                operation = 1;
                newLikedOpinionsId.push(req.body.opinionId);
            }
            console.log("nouvelle likedOPinionsId : " + newLikedOpinionsId);
            User.findOneAndUpdate(
                { _id: req.body.userId },
                { likedOpinionsId: newLikedOpinionsId },
                { new: true })
                .then(updatedUser => {
                    Opinion.findOne({ _id: req.body.opinionId })
                        .then(opinion => {
                            Opinion.findOneAndUpdate(
                                { _id: req.body.opinionId },
                                { likes: opinion.likes + operation },
                                { new: true })
                                .then(updatedOpinion => {
                                    console.log("Succès de la requête");
                                    res.status(201).json({
                                        user: updatedUser,
                                        opinion: updatedOpinion
                                    });
                                })
                                .catch(error => {
                                    console.log("Erreur dans l'update de l'avis" + error);
                                    res.status(400).json(error);
                                });
                        })
                        .catch(error => {
                            console.log("Erreur dans la récupération de l'avis" + error);
                            res.status(404).json(error);
                        });
                })
                .catch(error => {
                    console.log("Erreur dans l'update de l'user" + error);
                    res.status(400).json(error);
                });
        })
        .catch(error => {
            console.log("Erreur dans la récupération de l'user" + error);
            res.status(404).json(error);
        });
};
//     console.log("Lancement du like d'un film");
//     const action = "like" ? "like" : "dislike";
//     // Cette fonction est appelée quand l'utilisateur clique sur le pouce en l'air
//     // On va devoir modifier l'utilisateur (pour sa liste de films likés) et le film (pour son nombre de likes)
//     console.log("Lancement de la requête pour récupérer l'utilisateur");
//     User.findOne({ _id: req.body.userId })
//         .then(user => {
//             console.log("Utilisateur récupéré : " + user.nickname);
//             let newLikedFilmsId = user.likedFilmsId;
//             let newDislikedFilmsId = user.dislikedFilmsId;
//             let likesOperation, dislikesOperation = 0;
//             // Si l'id du film est présent dans la liste de l'utilisateur, on le supprime et on désincrémente le nombre de likes
//             if (newLikedFilmsId.includes(req.body.filmId)) {
//                 console.log("Like à enlever");
//                 const index = newLikedFilmsId.indexOf(req.body.filmId);
//                 newLikedFilmsId.splice(index, 1);
//                 likesOperation = -1;
//             }
//             // S'il est absent, on va incrémenter le nombre de likes 
//             // Mais on va également devoir vérifier que le film n'a pas été disliké : un utilisateur ne peut pas avoir deux avis contraires sur un film
//             else {
//                 console.log("Like à ajouter");
//                 newLikedFilmsId.push(req.body.filmId);
//                 likesOperation = 1;
//                 if (newDislikedFilmsId.includes(req.body.filmId)) {
//                     console.log("Puisque le film était disliké et va être liké, on enlève le dislike");
//                     const index2 = newDislikedFilmsId.indexOf(req.body.filmId);
//                     newDislikedFilmsId.splice(index, 1);
//                     dislikesOperation = -1;
//                 }
//             }
//             console.log("Lancement de l'update de l'user");
//             User.findOneAndUpdate(
//                 { _id: req.body.userId },
//                 {
//                     likedFilmsId: newLikedFilmsId,
//                     dislikedFilmsId: newDislikedFilmsId
//                 },
//                 { new: true })
//                 .then(updatedUser => {
//                     console.log("User mis à jour!");
//                     console.log("Lancement de la maj du film");
//                     Film.findOneAndUpdate(
//                         { _id: req.body.filmId },
//                         {
//                             $inc: { likes: likesOperation },
//                             $inc: { dislikes: dislikesOperation }
//                         },
//                         { new: true })
//                         .then(updatedFilm => {
//                             console.log("L'utilisateur " + updatedUser.nickname + " a bien ajouté ou enlevé un like au film " + updatedFilm.title + ".\nIl a été liké " + updatedFilm.likes + "fois");
//                             res.status(201).json({
//                                 user: updatedUser,
//                                 film: updatedFilm
//                             });
//                         })
//                         .catch(error => {
//                             console.log("Erreur dans la modification des likes au film d'id " + req.body.filmId + "\n" + error);
//                             res.status(400).json(error);
//                         });
//                 })
//                 .catch(error => {
//                     console.log("Erreur dans la modification de l'utilisateur pour ajouter le film liké à sa liste");
//                     res.status(400).json(error);
//                 });
//         })
//         .catch(error => {
//             console.log("Erreur dans la récupération de l'utilisateur");
//             res.status(400).json(error);
//         })
// };

// exports.dislikeFilm = (req, res, next) => {
//     // Même fonctionnement de la fonction de like
//     console.log("Lancement du dislike d'un film");
//     // Cette fonction est appelée quand l'utilisateur clique sur le pouce en l'air
//     // On va devoir modifier l'utilisateur (pour sa liste de films likés) et le film (pour son nombre de dislikes)
//     console.log("Lancement de la requête pour récupérer l'utilisateur");
//     User.findOne({ _id: req.body.userId })
//         .then(user => {
//             console.log("Utilisateur récupéré : " + user.nickname);
//             let newDislikedFilmsId = user.dislikedFilmsId;
//             let decision = 0;
//             // Si l'id du film est présent dans la liste de l'utilisateur, on le supprime et on désincrémente le nombre de dislikes, sinon on l'ajoute et on incrémente
//             if (!newDislikedFilmsId.includes(req.body.filmId)) {
//                 console.log("dislike à ajouter");
//                 newDislikedFilmsId.push(req.body.filmId);
//                 decision = 1;
//             }
//             else {
//                 console.log("dislike à enlever");
//                 const index = newDislikedFilmsId.indexOf(req.body.filmId);
//                 newDislikedFilmsId.splice(index, 1);
//                 decision = -1;
//             }
//             console.log("Lancement de l'update de l'user");
//             User.findOneAndUpdate(
//                 { _id: req.body.userId },
//                 { dislikedFilmsId: newDislikedFilmsId },
//                 { new: true })
//                 .then(updatedUser => {
//                     console.log("User mis à jour!");
//                     console.log("Lancement de la maj du film");
//                     Film.findOneAndUpdate(
//                         { _id: req.body.filmId },
//                         { $inc: { dislikes: decision } },
//                         { new: true })
//                         .then(updatedFilm => {
//                             console.log("L'utilisateur " + updatedUser.nickname + " a bien ajouté ou enlevé un dislike au film " + updatedFilm.title + ".\nIl a été disliké " + updatedFilm.dislikes + "fois");
//                             res.status(201).json({
//                                 user: updatedUser,
//                                 film: updatedFilm
//                             });
//                         })
//                         .catch(error => {
//                             console.log("Erreur dans la modification des dislikes au film d'id " + req.body.filmId + "\n" + error);
//                             res.status(400).json(error);
//                         });
//                 })
//                 .catch(error => {
//                     console.log("Erreur dans la modification de l'utilisateur pour ajouter le film liké à sa liste");
//                     res.status(400).json(error);
//                 });
//         })
//         .catch(error => {
//             console.log("Erreur dans la récupération de l'utilisateur");
//             res.status(400).json(error);
//         })
// };

exports.likeOrDislikeItem = (req, res, next) => {
    // La variable "action" détermine si l'user veut liker ou disliker le film
    const action = (req.body.action === "like") ? "like" : "dislike";
    const itemType = req.body.itemType;
    console.log(`Lancement du ${action} d'un ${itemType}`);
    // On va devoir modifier l'utilisateur (pour sa liste de films likés/dislikés) et le film (pour son nombre de likes/dislikes)
    console.log("Lancement de la requête pour récupérer l'utilisateur");
    User.findOne({ _id: req.body.userId })
        .then(user => {
            console.log("Utilisateur récupéré : " + user.nickname);
            let newLists = {};
            if (itemType === "film") {
                newLists = {
                    likes: user.likedFilmsId,
                    dislikes: user.dislikedFilmsId
                };
            }
            let likesOperation = 0;
            let dislikesOperation = 0;

            if (action === "like") {
                // Si l'id du film est présent dans la liste de l'utilisateur, on le supprime et on désincrémente le nombre de likes
                if (newLists.likes.includes(req.body.itemId)) {
                    console.log("Like à enlever");
                    const index = newLists.likes.indexOf(req.body.itemId);
                    newLists.likes.splice(index, 1);
                    likesOperation = -1;
                }
                // S'il est absent, on va incrémenter le nombre de likes 
                // Mais on va également devoir vérifier que le film n'a pas été disliké : un utilisateur ne peut pas avoir deux avis contraires sur un film
                else {
                    console.log("Like à ajouter");
                    newLists.likes.push(req.body.itemId);
                    likesOperation = 1;
                    if (newLists.dislikes.includes(req.body.itemId)) {
                        console.log("Puisque le film était disliké et va être liké, on enlève le dislike");
                        const index2 = newLists.dislikes.indexOf(req.body.itemId);
                        newLists.dislikes.splice(index2, 1);
                        dislikesOperation = -1;
                    }
                }
            }
            // Et si l'opération est un dislike, on utilise la même logique mais pour les dislikes
            else {
                if (newLists.dislikes.includes(req.body.itemId)) {
                    console.log("Dislike à enlever");
                    const index = newLists.dislikes.indexOf(req.body.itemId);
                    newLists.dislikes.splice(index, 1);
                    dislikesOperation = -1;
                }
                else {
                    console.log("Dislike à ajouter");
                    newLists.dislikes.push(req.body.itemId);
                    dislikesOperation = 1;
                    if (newLists.likes.includes(req.body.itemId)) {
                        console.log("Puisque le film était liké et va être disliké, on enlève le like");
                        const index2 = newLists.likes.indexOf(req.body.itemId);
                        newLists.likes.splice(index2, 1);
                        likesOperation = -1;
                    }
                }
            }
            console.log("Résumé");
            console.log("likeoperation : " + likesOperation);
            console.log("dislikeoperation : " + dislikesOperation);
            console.log("Lancement de l'update de l'user");
            let change = {};
            if (itemType === "film") {
                change = {
                    likedFilmsId: newLists.likes,
                    dislikedFilmsId: newLists.dislikes
                };
            }
            User.findOneAndUpdate(
                { _id: req.body.userId },
                change,
                { new: true })
                .then(updatedUser => {
                    console.log("User mis à jour!");
                    console.log("Lancement de la maj du film");
                    if (itemType === 'film') {
                        Film.findOneAndUpdate(
                            { _id: req.body.itemId },
                            {
                                $inc: {
                                    likes: likesOperation,
                                    dislikes: dislikesOperation
                                }
                            },
                            { new: true })
                            .then(updatedFilm => {
                                console.log("L'utilisateur " + updatedUser.nickname + " a bien ajouté ou enlevé un like au film " + updatedFilm.title + ".\nIl a été liké " + updatedFilm.likes + "fois");
                                res.status(201).json({
                                    user: updatedUser,
                                    film: updatedFilm
                                });
                            })
                            .catch(error => {
                                console.log("Erreur dans la modification des likes au film d'id " + req.body.itemId + "\n" + error);
                                res.status(400).json(error);
                            });
                    }

                })
                .catch(error => {
                    console.log("Erreur dans la modification de l'utilisateur pour ajouter le film liké à sa liste\n" + error);
                    res.status(400).json(error);
                });
        })
        .catch(error => {
            console.log("Erreur dans la récupération de l'utilisateur\n" + error);
            res.status(400).json(error);
        })
}

// exports.fix = (req, res, next) => {
//     Film.find().then(films => {
//         let i = 0;
//         let tempFilms = [];
//         films.forEach(film => {
//             const tempFilm = new TempFilm({
//                 title: film.title,
//                 author: film.director,
//                 description: film.description,
//                 date: film.date,
//                 genres: film.genres,
//                 imageUrl: film.imageUrl,
//                 likes: film.likes,
//                 dislikes: film.dislikes,
//                 opinionsId: film.opinionsId
//             });
//             tempFilm.save().then(savedFilm => {
//                 tempFilms.push(savedFilm);
//                 i++;
//                 if (i == films.length) {
//                     User.find().then(users => {
//                         users.forEach(user => {
//                             let userUpdate = false;
//                             let newLikedList = user.likedFilmsId;
//                             let newDislikedList = user.dislikedFilmsId;
//                             if (user.likedFilmsId.includes(film._id)) {
//                                 userUpdate = true;
//                                 const index = user.likedFilmsId.indexOf(film._id);
//                                 newLikedList.splice(index, 1);
//                                 newLikedList.push()
//                             }
//                             else if (user.dislikedFilmsId.includes(film._id)) {
//                                 userUpdate = true;
//                                 const index = user.dislikedFilmsId.indexOf(film._id);
//                                 newDislikedList.splice(index, 1);
//                             }
//                             if (userUpdate) {
//                                 User.findOneAndUpdate(
//                                     { _id: user._id },
//                                     {
//                                         likedFilmsId: newLikedList,
//                                         dislikedFilmsId: newDislikedList
//                                     },
//                                     { new: true }
//                                 ).then()
//                                     .catch(error => {
//                                         const message = "Erreur lors de l'update de l'user";
//                                         res.status(400).json({
//                                             erreur: error,
//                                             msg: message
//                                         });
//                                     });
//                             }
//                         });
//                     })
//                         .catch(error => {
//                             const message = "Erreur lors de la récupération des users";
//                             console.log('message');
//                             res.status(400).json({ erreur: error, msg: message });
//                         });
//                 }
//             }).catch(error => {
//                 const message = "Erreur lors de la sauvegarde du film temporaire";
//                 console.log('message');
//                 res.status(400).json({ erreur: error, msg: message });
//             });
//         });
//     })
//         .catch(error => {
//             const message = "Erreur lors de la récupération des films";
//             console.log('message');
//             res.status(400).json({ erreur: error, msg: message });
//         });
// }