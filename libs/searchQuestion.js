const readline = require("readline").createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false,
});
const fs = require("fs");
const path = require("path");
const afficheQuestion = require("./afficheQuestion.js");

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
        //console.log(question)
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
            console.log(question);
            questionsWKeywords.push(consigne + "|||" + question);
            //console.log(questionsWKeywords[questionsWKeywords.length - 1]);
            break;
          }
        }
      }
    }
  });
  return questionsWKeywords;
}
async function addQuestion(questionsWKeywords) {
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
  fs.readdirSync("./examens").forEach((file) => {
    if (file === nomExam + ".gift") {
      fs.appendFileSync(
        path.join("./examens", file),
        questionsWKeywords[numQuest] + "\n\n",
        "utf8"
      );
    }
  });
}

async function searchAddQuestion() {
  let reponse = "";
  let questionsWKeywords;
  while (reponse != "1" && reponse != "2") {
    reponse = await new Promise((resolve) => {
      readline.question(
        "\nRechercher par mot clés(1) ou pas type de questions(2) : ",
        resolve
      );
    });
  }
  if (reponse === "1") {
    reponse = await new Promise((resolve) => {
      readline.question(
        "\nmots clé à rechercher, séparés par une virgule : ",
        resolve
      );
    });
    questionsWKeywords = getQuestionsWkeyword(
      "./SujetB_data",
      reponse.split(",")
    );
    afficheQuestion(questionsWKeywords);
  } else {
  }
  await addQuestion(questionsWKeywords);
}

module.exports = searchAddQuestion;
