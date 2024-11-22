const createExamFile = require('./libs/create_exam_file.js')
var end = false;
const readline = require("readline").createInterface({
  input: process.stdin,
  output: process.stdout,
});
async function main() {
  while (!end) {
    let reponse = await new Promise((resolve) => {
      readline.question(
        "Que souhaitez vous faire : \n - créer un examen(1)\n - rechercher et visualiser une question(2) \n - Ajouter une question à un examen(3) \n - Générer un fichier d'identification d'un enseignant (4)\n - Vérifier la qualité d'une fichier d'examen(5)\n - Simuler un test et afficher le bilan(6) \n - Analyser les données des examens(7)\n - Composer et visualiser le profil d'un examen(8)\n - Comparer un profil d'examen à l'un de ceux de la baqnue de question(9)",
        resolve
      );
    });
    switch (reponse) {
      case "1":
        createExamFile();
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
      default:
        break;
    }
  }
}
main();
