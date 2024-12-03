const fs = require("fs");
const readline = require("readline").createInterface({
  input: process.stdin,
  output: process.stdout,
});
async function checkFileName(reponse) {
     // Lire les fichiers dans le dossier courant
     var titre = true;
     try {
        const files = await fs.promises.readdir("./examens");
        files.forEach((file) => {
          if (`${reponse}.gift` == file) {
            console.log("Un examen du même nom existe déjà");
            titre = false;
          }
        });
      } catch (err) {
        console.error("Erreur:", err);
        return;
      }
    return titre;
}

async function createFile(reponse){
    await fs.promises.writeFile(`./examens/${reponse}.gift`, '');
    console.log('Fichier créé');
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
module.exports = {createExamFile , checkFileName, createFile};
