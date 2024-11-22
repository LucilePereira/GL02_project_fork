const fs = require("fs");
const readline = require("readline").createInterface({
  input: process.stdin,
  output: process.stdout,
});
async function checkFileName(reponse) {
     // Lire les fichiers dans le dossier courant
     var titre = true;
     fs.readdir("./examens", (err, files) => {
        if (err) {
          console.error("Erreur:", err);
          return;
        }
        
        files.forEach((file) => {
          if (reponse == file) {
            console.log("Un examen du même nom existe déjà");
            titre = false;
          }
        });
      });
    return titre;
}

async function createFile(reponse){
    fs.writeFile(`./examens/${reponse}.gift`, '', (err) => {
        if (err) throw err;
        console.log('Fichier créé');
    });
}

async function createExamFile() {
  let titre = false;
  while (!titre) {
    let reponse = await new Promise((resolve) => {
      readline.question("\nTitre de l'examen : ", resolve);
    });

    titre = await checkFileName(reponse);

    if (titre){
        await createFile(reponse)
    }
  }
}
module.exports = createExamFile;
