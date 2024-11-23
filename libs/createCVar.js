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
      readline.question("\n Nom du fichier : ", (answer) => {
        resolve(answer);
      });
    });
  };

  let reponse = await askForFileName(); 
  
  let cheminFile = "./examens/" + reponse + ".CVar";



}