const Opinion = require('../models/opinion');



exports.getOneOpinion = (req, res, next) => {
    Opinion.findOne({ _id: req.params.id })
        .then(opinion => {
            res.status(200).json(opinion);
        })
        .catch(error => {
            console.log("L'avis n'a pas été trouvé");
            res.status(404).json(error);
        });
};

exports.editOpinion = (req, res, next) => {
    console.log("opinionCOntroller.editOpinion");
    console.log("opinionId : " +req.params.id);
    console.log("content : "+req.body.content);
    Opinion.findOneAndUpdate(
        { _id: req.params.id },
        { content: req.body.content },
        { new: true }
    ).then(opinion => { 
        console.log("opinion modifiée : "+opinion.content);
        res.status(201).json(opinion);
     })
        .catch(error => {
            console.log(error);
            res.status(400).json(error);
        })
}

// exports.fixOpinions = (req, res, next) => {
//     const User = require('../models/user');
//     User.find().then(users => {
//         const length = users.length;
//         let i = 0;
//         users.forEach(user=>{
//             console.log("user "+user.nickname);
//             let newList = [];
//             User.findOneAndUpdate(
//                 {_id:user._id},
//                 {
//                     opinionsId:newList,
//                     likedOpinionsId:newList
//                 },
//                 {new:true}
//             )
//             .then(()=>{
//                 i++;
//                 if (i == length){
//                     res.status(201).json("fait")
//                 }
                
//         })
//         })
//     });
        
// };

// exports.fixOpinionLikes = (req, res, next) => {
//     const User = require('../models/user');
//     User.find().then(users => {
//         let iFinal = 0;
//         const lengthFinal = users.length;
//         users.forEach(user => {
//             console.log("User numéro " + iFinal + ", " + user.nickname + ", en cours");
//             console.log("likedOpinionsId : " + user.likedOpinionsId);
//             const length = user.likedOpinionsId.length;
//             let i = 0;
//             let validList = [];
//             user.likedOpinionsId.forEach(likedOpinionId => {
//                 Opinion.findOne({ _id: likedOpinionId }).then(opinion => {
//                     validList.push(opinion._id);
//                     if (i == length) {
//                         console.log("Liste itérée : i = " + i + " et length = " + length);
//                         console.log(validList);
//                         User.findOneAndUpdate(
//                             { _id: user._id },
//                             { likedOpinionsId: validList },
//                             { new: true }
//                         ).then(() => {
//                             iFinal++;
//                             if (iFinal == lengthFinal) {
//                                 res.status(201).json("fait")
//                             }
//                         })
//                             .catch(error => res.status(400).json("erreur durant l'update " + iFInal + "\n" + error));
//                     }
//                 })
//                     .catch(error => {
//                         console.log("Erreur pendant la récupération de l'opinion " + opinion._id + "\n" + error);
//                     });
//                 i++;
//             });
//         });
//     });
// };

// exports.getAllOpinions = (req,res,next) => {
//   Opinion.find().then(opinions=>res.status(200).json(opinions));
// };

// exports.eraseAllOpinions = (req,res,next) => {
//     Opinion.find().then(opinions=>{
//         const length = opinions.length;
//         let i = 0;
//         opinions.forEach(opinion=>{
//             Opinion.deleteOne({_id:opinion._id}).then(()=>{
//                 i++;
//                 console.log("Opinion "+i+" supprimé");
//                 if (i === length){
//                     res.status(200).json("c'est bon lol")
//                 }
//             })
//         })
//     })
// };

