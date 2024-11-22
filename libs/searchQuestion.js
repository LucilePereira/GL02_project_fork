const readline = require("readline").createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false,
});
const fs = require("fs");
const path = require("path");
function getQuestions(directory, keywords) {
  var questionsWKeywords = [];
  fs.readdirSync(directory).forEach((file) => {
    const fullPath = path.join(directory, file);
    if (fs.lstatSync(fullPath).isFile()) {
      // Si c'est un fichier, lire et afficher le contenu
      const content = fs.readFileSync(fullPath, "utf8");
      const questions = content.split("\n\n");
      for (let question of questions) {
        if (question.substring(0, 2) == "::") {
          console.log(question);
          for (let keyword of keywords) {
            if (question.toLowerCase().includes(keyword.toLowerCase())) {
              questionsWKeywords.push(question);
              console.log(keyword);
              break;
            }
          }
        }
      }
    }
  });
  return questionsWKeywords;
}
async function searchQuestion() {
  let reponse = await new Promise((resolve) => {
    readline.question(
      "\nRechercher par mot clés(1) ou pas type de questions(2) : ",
      resolve
    );
  });
  if (reponse === "1") {
    reponse = await new Promise((resolve) => {
      readline.question(
        "\nmots clé à rechercher, séparés par une virgule : ",
        resolve
      );
    });
    const questionsWKeywords = getQuestions(
      "./SujetB_data",
      reponse.split(",")
    );
    console.log("Questions trouvées : \n");
    for (var i = 0; i < questionsWKeywords.length; i++) {
      console.log("\n " + i + " - " + questionsWKeywords[i]);
    }
  } else {
  }
  reponse = await new Promise((resolve) => {
    readline.question(
      "\nNom de l'examen auquel ajouter une de ces question : ",
      resolve
    );
  });
}

module.exports = searchQuestion;
