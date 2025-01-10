const fs = require("fs");
const path = require("path");
const afficheQuestion = require("./afficheQuestion.js");
const getCategorieQuestion = require("./categorieQuestion.js");
const {openDirectory} = require('./askAndOpen.js');
const {openFile} = require('./askAndOpen.js');
const {askQuestion} = require('./askAndOpen.js');
const {askAndTryFile} = require('./askAndOpen.js');

function getQuestionsWCateg(dir, categs) {
  var questionsWCateg = [];
  var hasFoundAnyQuestion = false;
  openDirectory(dir).forEach((file) => {
    const fullPath = path.join(dir, file);
    if (fs.lstatSync(fullPath).isFile()) {
      const content = openFile(fullPath);
      const questions = content.split("\n\n");
      let isNewExercise = true;
      let consigne = "";
      for (let question of questions) {
        if (question.substring(0, 1) === "$") {
          continue;
        }
        if (question.substring(0, 2) === "//") {
          isNewExercise = true;
          continue;
        }
        if (isNewExercise) {
          const parts = question.split("::");
          consigne = parts[parts.length - 1];
          isNewExercise = false;
          continue;
        }
        if (categs.includes(getCategorieQuestion(question))) {
          questionsWCateg.push(consigne + "|||" + question);
          hasFoundAnyQuestion = true;
        }
      }
    }
  })
  return questionsWCateg;
}

async function addQuestion(questions) {

  if (!questions || questions.length === 0 || questions[0] === "Aucune question correspondant aux mots-clés trouvée.") {
    console.log("\nImpossible d'ajouter une question : aucune question correspondant aux mots-clés n'a été trouvée.");
    return; // Arrêter l'exécution de la fonction
  }

  
  let numQuest = parseInt(await askQuestion("\nNuméro de la question à ajouter : "), 10);
  let exam = await askAndTryFile ("\nAdresse de l'examen auquel ajouter une de ces question : ")

  while (isNaN(numQuest) || numQuest < 0 || numQuest >= questions.length) {
    console.log("\nNuméro de question invalide. Veuillez réessayer.");
    numQuest = parseInt(await askQuestion("\nNuméro de la question à ajouter : "), 10);
  }
  if (exam.exists) {
    fs.appendFileSync(
      "./" + exam.path,
      questions[numQuest] + "\n\n",
      "utf8"
      );
    console.log("Fichier modifié !");
  }
  else {
    try {
      fs.promises.writeFile(
        "./" + exam.path,
        questions[numQuest] + "\n\n",
        "utf8"
        );
      console.log("Fichier créé avec succès");
    } catch (err) {
      console.error("Erreur lors de l'écriture du fichier :", err);
    }
  }
}

function getQuestionsWkeyword(directory, keywords) {
  var questionsWKeywords = [];
  var hasFoundAnyQuestion = false; // Variable pour vérifier si au moins une question a été trouvée

  openDirectory(directory).forEach((file) => {
    const fullPath = path.join(directory, file);
    if (fs.lstatSync(fullPath).isFile()) {
      // Si c'est un fichier, lire et afficher le contenu
      const content = openFile(fullPath);
      const questions = content.split("\n\n");
      let isNewExercise = true;
      let consigne = "";

      for (let question of questions) {
        if (question.substring(0, 1) === "$") {
          continue;
        }
        if (question.substring(0, 2) === "//") {
          isNewExercise = true;
          continue;
        }

        if (isNewExercise) {
          const parts = question.split("::");
          consigne = parts[parts.length - 1];
          isNewExercise = false;
          continue;
        }

        for (let keyword of keywords) {
          if (question.toLowerCase().includes(keyword.toLowerCase())) {
            questionsWKeywords.push(consigne + "|||" + question);
            hasFoundAnyQuestion = true; // Indique qu'une question a été trouvée
            break;
          }
        }
      }
    }
  return questionsWKeywords
  });

  // Si aucune question correspondant aux mots-clés n'a été trouvée dans tout le dossier
  if (hasFoundAnyQuestion) {
   return questionsWKeywords;
  }
}

async function searchAddQuestion() {
  let reponse = "";
  let questionsSelected;
  while (reponse != "1" && reponse != "2") {
    reponse = await askQuestion("\nRechercher par mot clés(1) ou par type de questions(2) : ");
  }
  if (reponse === "1") {
    reponse = await askQuestion("\nMots clé à rechercher, séparés par une virgule : ");
    questionsSelected = getQuestionsWkeyword(
      "./SujetB_data",
      reponse.split(",")
      );
  } else {
    reponse = await askQuestion("\nType de question à rechercher : question ouverte(1), question fermée(2) ");
    if (reponse === "1") {
      questionsSelected = getQuestionsWCateg("./SujetB_data", [
        "mot manquant",
        "question ouverte",
        ]);
    } else {
      questionsSelected = getQuestionsWCateg("./SujetB_data", [
        "correspondance",
        "vrai faux",
        "choix multiple",
        ]);
    }
  }

  if(questionsSelected !== undefined){
    afficheQuestion(questionsSelected);
    await addQuestion(questionsSelected);
  }
  else{
    console.log("\nImpossible d'ajouter une question : aucune question correspondant aux mots-clés n'a été trouvée.\n");
    return; // Arrêter l'exécution de la fonction
  }
};

module.exports = { searchAddQuestion, getQuestionsWkeyword, getQuestionsWCateg, addQuestion }
