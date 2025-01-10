const {askAndOpenFile} = require('./askAndOpen.js');


async function qualiteExamen() {  
    let file = await askAndOpenFile(); 
    let fichierSplit = file.data.split("\n\n")
    
    //const questions = matches.map(match => match.replace(/\n\n/g, '').trim());
    let nbQuestions = fichierSplit.length - 1
    // Vérifier la présence de doublons
    const questionSet = new Set(fichierSplit); // Créer un Set pour les questions uniques
    const hasDuplicates = questionSet.size !== fichierSplit.length;
    //const questionCount = matches ? matches.length : 0;

    let message;
    if(hasDuplicates){
        if (nbQuestions < 15 || nbQuestions > 20 ) {
            message = "L'examen contient " + nbQuestions + " question(s). \n L'examen contient des doublons. \n L'examen n'est pas valide car il n'a pas entre 15 et 20 questions et qu'il a des doublons'.";
          } else {
            message = "L'examen contient " + nbQuestions + " questions. \n L'examen contient des doublons. \n L'examen n'est pas valide car il a des doublons.";
          }
    }
    else{
        if (nbQuestions < 15 || nbQuestions > 20 ) {
            message = "L'examen contient " + nbQuestions + " question(s). \n L'examen ne contient pas de doublons. \n L'examen n'est pas valide car il n'a pas entre 15 et 20 questions.";
          } else {
            message = "L'examen contient " + nbQuestions + " questions. \n L'examen ne contient pas de doublons. \n L'examen est valide.";
          }
    }
    

    console.log(message);
}

module.exports = qualiteExamen;
