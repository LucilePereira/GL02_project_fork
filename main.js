//faire npm install dans la console a la racine du projet
const createExamFile = require('./libs/create_exam_file.js');
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
3 - Ajouter une question à un examen
4 - Générer un fichier d'identification d'un enseignant
5 - Vérifier la qualité d'une fichier d'examen
6 - Simuler un test et afficher le bilan
7 - Analyser les données des examens
8 - Composer et visualiser le profil d'un examen
9 - Comparer un profil d'examen à l'un de ceux de la banque de question
0 - Quitter
Votre choix : `;

      const reponse = await askQuestion(menu);

      switch (reponse) {
        case "1":
          await createExamFile();
          break;
        case "2":
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
        case "9":
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
