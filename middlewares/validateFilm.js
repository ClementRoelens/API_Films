const config = require("config");
const genres = config.get("Genres");
const Ajv = require("ajv");
const addFormats = require("ajv-formats");

module.exports = (req, res, next) => {
    // On va ici vérifier la validité des données envoyés pour créer un nouveau film, en utilisant ajv

    // Les genres sont espacés par des virgules dans un seul objet string, donc on va en faire une array
    const genresArray = req.body.genres.split(",");
    console.log("Validator : genres : " + genresArray);

    const data = {
        titre: req.body.titre,
        realisateur: req.body.realisateur,
        description: req.body.description,
        date: req.body.date,
        genres: genresArray
    };
    // On accepte comme genres que les genres définis par l'application, c'est pour cela qu'on utilise une enum
    const schema = {
        type: "object",
        properties: {
            titre: { type: "string" , minLength: 1},
            realisateur: { type: "string" , minLength: 1 },
            description: { type: "string" , minLength: 1 },
            date: { type: "string", format: "date" },
            genres: {
                type: "array",
                items: {
                    type: "string",
                    enum: genres
                },
                "uniqueItems": true,
                "minItems": 1
            }
        }
    };
    const ajv = new Ajv();
    addFormats(ajv);
    const validate = ajv.compile(schema)
    const valid = validate(data);

    if (valid){
        // Et on vérifie également si un fichier a bien été passé
        if (req.file){
            console.log("Ajv : le test a été passé");
            next();
        }
        else {
            console.log("Ajv : test passé mais passé aucune image");
            res.status(400).json({message:"Vous n'avez passé aucune image"});
        }

    }
    else {
        console.log("Ajv : le test n'a pas été passé");
        // Si les données ne sont pas bonnes, on renvoie l'erreur ainsi que le schéma global
        const message = {
            message : "Les données passées ne sont pas au bon format. Pour Rappel il faut :",
            titre : "string",
            realisateur : "string",
            description : "string",
            date : "une date valide au format YYYY-MM-DD",
            genres : "string parmi les gens autorisés, espacés uniquement par une virgule",
            genres_autorisés : genres,
            errors : validate.errors
        }
        res.status(400).json(message);
    }
};