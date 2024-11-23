const readline = require("readline").createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false,
});
const fs = require("fs");
const path = require("path");
const afficheQuestion = require("./afficheQuestion.js");
const getCategorieQuestion = require("./categorieQuestion.js");

function getQuestionsWkeyword(directory, keywords) {
  var questionsWKeywords = [];
  fs.readdirSync(directory).forEach((file) => {
    const fullPath = path.join(directory, file);
    if (fs.lstatSync(fullPath).isFile()) {
      // Si c'est un fichier, lire et afficher le contenu
      const content = fs.readFileSync(fullPath, "utf8");
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
          console.log(
            question.toLocaleLowerCase() + " " + keyword.toLowerCase()
          );
          if (question.toLowerCase().includes(keyword.toLowerCase())) {
            console.log(question);
            questionsWKeywords.push(consigne + "|||" + question);
            break;
          }
        }
      }
    }
  });
  return questionsWKeywords;
}
function getQuestionWCateg(dir, categs) {
  var questionsWCateg = [];
  fs.readdirSync(dir).forEach((file) => {
    const fullPath = path.join(dir, file);
    if (fs.lstatSync(fullPath).isFile()) {
      const content = fs.readFileSync(fullPath, "utf8");
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
        }
      }
    }
  });
  return questionsWCateg;
}
async function addQuestion(questions) {
  let nomExam = await new Promise((resolve) => {
    readline.question(
      "\nNom de l'examen auquel ajouter une de ces question : ",
      resolve
    );
  });
  let numQuest = parseInt(
    await new Promise((resolve) => {
      readline.question("\nNuméro de la question à ajouter : ", resolve);
    }),
    10
  );
  let isWritten = false;
  fs.readdirSync("./examens").forEach((file) => {
    if (file === nomExam + ".gift") {
      fs.appendFileSync(
        path.join("./examens", file),
        questions[numQuest] + "\n\n",
        "utf8"
      );
      isWritten = true;
      console.log("Fichier modifié !");
    }
  });
  if (!isWritten) {
    try {
      await fs.promises.writeFile(
        "./examens/" + nomExam + ".gift",
        questions[numQuest] + "\n\n",
        "utf8"
      );
      console.log("Fichier créé avec succès");
    } catch (err) {
      console.error("Erreur lors de l'écriture du fichier :", err);
    }
  }
}

async function searchAddQuestion() {
  let reponse = "";
  let questionsSelected;
  while (reponse != "1" && reponse != "2") {
    reponse = await new Promise((resolve) => {
      readline.question(
        "\nRechercher par mot clés(1) ou par type de questions(2) : ",
        resolve
      );
    });
  }
  if (reponse === "1") {
    reponse = await new Promise((resolve) => {
      readline.question(
        "\nMots clé à rechercher, séparés par une virgule : ",
        resolve
      );
    });
    questionsSelected = getQuestionsWkeyword(
      "./SujetB_data",
      reponse.split(",")
    );
  } else {
    reponse = await new Promise((resolve) => {
      readline.question(
        "\nType de question à rechercher : question ouverte(1), question fermée(2) ",
        resolve
      );
    });
    if (reponse === "1") {
      questionsSelected = getQuestionWCateg("./SujetB_data", [
        "mot manquant",
        "question ouverte",
      ]);
    } else {
      questionsSelected = getQuestionWCateg("./SujetB_data", [
        "correspondance",
        "vrai faux",
        "choix multiple",
      ]);
    }
  }
  afficheQuestion(questionsSelected);
  await addQuestion(questionsSelected);
}

module.exports = searchAddQuestion;
