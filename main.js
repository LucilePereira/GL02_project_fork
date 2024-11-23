//faire npm install dans la console a la racine du projet
const createExamFile = require('./libs/create_exam_file.js');
const searchAddQuestion = require('./libs/searchQuestion.js');
const readline = require("readline").createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});

function askQuestion(question) {
  return new Promise((resolve) => {
    readline.question(question, (answer) => {
      resolve(answer);
      readline.prompt(); // Affiche le prompt après chaque question
    });
  });
}

async function main() {
  try {
    while (true) {
      const menu = `Que souhaitez vous faire :
1 - créer un examen
2 - rechercher et visualiser une question
3 - Générer un fichier d'identification d'un enseignant
4 - Vérifier la qualité d'une fichier d'examen
5 - Simuler un test et afficher le bilan
6 - Analyser les données des examens
7 - Composer et visualiser le profil d'un examen
8 - Comparer un profil d'examen à l'un de ceux de la banque de question
0 - Quitter
Votre choix : `;

      const reponse = await askQuestion(menu);

      switch (reponse) {
        case "1":
          await createExamFile();
          break;
        case "2":
        await searchAddQuestion();
          break;
        case "3":
          break;
        case "4":
          break;
        case "5":
          break;
        case "6":
          break;
        case "7":
          break;
        case "8":
          break;
        case "0":
          console.log("Au revoir !");
          readline.close();
          return;
        default:
          console.log("Option non valide");
          break;
      }
    }
  } catch (error) {
    console.error('Une erreur est survenue:', error);
    readline.close();
  }
}

// S'assurer que le script ne s'exécute qu'une seule fois
if (require.main === module) {
  main();
}
