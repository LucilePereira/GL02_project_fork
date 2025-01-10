const fs = require("fs");
const {askAndTryFile} = require('./askAndOpen.js');


async function createFile(reponse){
    await fs.promises.writeFile(reponse, '');
    console.log('Fichier créé');
}

async function createExamFile() {
    let file = await askAndTryFile("\nTitre de l'examen : ");
    
    while (file.exists) {
        console.log("Un examen du même nom existe déjà");
        file = await askAndTryFile("\nTitre de l'examen : ");
    }
    await createFile(file.path)
}
module.exports = {createExamFile, createFile};
