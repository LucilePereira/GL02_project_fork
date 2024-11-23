const fs = require("fs");


async function qualiteExamen() {
  // Demander à l'utilisateur de saisir le nom du fichier d'examen
  const readline = require("readline").createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal:false
  });


const askForFileName = () => {
    return new Promise((resolve) => {
      readline.question("\nTitre de l'examen : ", (answer) => {
        resolve(answer);
      });
    });
  };

  let reponse = await askForFileName(); 
  
  let cheminFile = "./examens/" + reponse + ".gift";

  // Tester si le nom donné existe 
  while (!fs.existsSync(cheminFile)) {
    console.log(`Le fichier "${reponse}.gift" n'existe pas. Veuillez entrer un nom valide.`);
    reponse = await askForFileName(); 
    cheminFile = "./examens/" + reponse + ".gift"; 
  }

  try {
    const fileContent = fs.readFileSync(cheminFile, "utf8");
   // const regex = /::(.*?)::/g;
   // const matches = fileContent.match(regex);
    let fichierSplit = fileContent.split("\n\n")
    console.log(fichierSplit)
    //const questions = matches.map(match => match.replace(/\n\n/g, '').trim());
    let nbQuestions = fichierSplit.length - 1
    // Vérifier la présence de doublons
    const questionSet = new Set(fichierSplit); // Créer un Set pour les questions uniques
    const hasDuplicates = questionSet.size !== fichierSplit.length;
    //const questionCount = matches ? matches.length : 0;

    let message;
    if(hasDuplicates){
        if (nbQuestions < 15 || nbQuestions > 20 ) {
            message = "L'examen contient " + nbQuestions + " question(s). \n L'examen contient des doublons. \n L'examen n'est pas valide.";
          } else {
            message = "L'examen contient " + nbQuestions + " questions. \n L'examen continet des doublons. \n L'examen n'est pas valide.";
          }
    }
    else{
        if (nbQuestions < 15 || nbQuestions > 20 ) {
            message = "L'examen contient " + nbQuestions + " question(s). \n L'examen ne contient pas de doublons. \n L'examen n'est pas valide.";
          } else {
            message = "L'examen contient " + nbQuestions + " questions. \n L'examen ne continet pas de doublons. \n L'examen est valide.";
          }
    }
    

    console.log(message);
  } 
  catch (error) {
    console.error("Une erreur est survenue lors de la lecture du fichier : " + error.message);
  } finally {
    readline.close(); // Fermer l'interface readline
  }
}

module.exports = qualiteExamen;
