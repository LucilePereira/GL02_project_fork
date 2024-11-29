const fs = require('fs');
const path = require('path');
const readline = require('readline');

const extractAnswerBlock = (question) => {
    const answerBlockPattern = /(?:=|\~|\#|TRUE|FALSE|T|F|->)[^\n]*/g;
    const matches = (question.match(answerBlockPattern) || []).join(' ');
    console.log(`Réponses extraites : ${matches}`);  
    return matches;
};


const detectQuestionType = (question) => {
    const answerBlock = extractAnswerBlock(question);

    
    if (answerBlock.includes('~') && answerBlock.includes('=')) {
        return 'Choix multiples';
    }

    
    if (answerBlock.includes('->')) {
        return 'Correspondance';
    }

  
    if (/^\s*(TRUE|FALSE|T|F)\b/i.test(answerBlock.trim())) {
        return 'Vrai/Faux';
    }

  
    if (/^#|=\d+(:|..)/i.test(answerBlock)) {
        return 'Numérique';
    }

   
    if (/\{\}/.test(question)) {
        return 'Mot manquant';
    }

    
    if (question.includes('?') && !answerBlock.includes('=') && !answerBlock.includes('~')) {
        return 'Questions ouvertes';
    }

  
    return 'Questions ouvertes';
};


const analyzeQuestions = (filePath) => {
    if (fs.lstatSync(filePath).isDirectory()) {
        return {}; 
    }

    const content = fs.readFileSync(filePath, 'utf-8');
   

    const questions = {
        'Choix multiples': 0,
        'Vrai/Faux': 0,
        'Correspondance': 0,
        'Mot manquant': 0,
        'Numérique': 0,
        'Questions ouvertes': 0
    };

   
    const questionPattern = /::([^:]+)::([^{]+)\{([^\}]+)\}/g;
    let match;

   
    while ((match = questionPattern.exec(content)) !== null) {
        const question = match[0]; 
        const questionType = detectQuestionType(question); 

        console.log(`Question: "${question}" -> Type: ${questionType}`);

       
        if (questions[questionType] !== undefined) {
            questions[questionType]++;
        }
    }

    return questions;
};


async function compareProfiles() {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        terminal: false
    });

    
    const askForFolderPathReference = () => {
        return new Promise((resolve) => {
            rl.question("\nChemin du dossier contenant le fichier de référence (ex : 'SujetA_data') : ", (answer) => {
                resolve(answer.trim());
            });
        });
    };

    
    const askForFolderPathExam = () => {
        return new Promise((resolve) => {
            rl.question("\nChemin du dossier contenant le fichier d'examen (ex : 'SujetB_data') : ", (answer) => {
                resolve(answer.trim()); 
        });
    };

   
    const askForReferenceFile = () => {
        return new Promise((resolve) => {
            rl.question("\nNom du fichier moyen de référence (ex : 'moyen.gift') : ", (answer) => {
                resolve(answer.trim()); 
            });
        });
    };

    
    const askForFile = () => {
        return new Promise((resolve) => {
            rl.question("\nNom du fichier d'examen (ex : 'examen.gift') : ", (answer) => {
                resolve(answer.trim()); 
            });
        });
    };

   
    let folderPathReference = await askForFolderPathReference();

   
    while (!fs.existsSync(folderPathReference) || !fs.lstatSync(folderPathReference).isDirectory()) {
        console.log(`Le chemin "${folderPathReference}" n'existe pas ou n'est pas un dossier valide.`);
        folderPathReference = await askForFolderPathReference();
    }

    
    let referenceFileName = await askForReferenceFile();

    
    let referenceFilePath = path.join(folderPathReference, referenceFileName);
    while (!fs.existsSync(referenceFilePath)) {
        console.log(`Le fichier de référence "${referenceFileName}" n'existe pas dans le dossier.`);
        referenceFileName = await askForReferenceFile();
        referenceFilePath = path.join(folderPathReference, referenceFileName);
    }

    console.log(`Le fichier de référence trouvé : ${referenceFilePath}`);

    
    let folderPathExam = await askForFolderPathExam();

   
    while (!fs.existsSync(folderPathExam) || !fs.lstatSync(folderPathExam).isDirectory()) {
        console.log(`Le chemin "${folderPathExam}" n'existe pas ou n'est pas un dossier valide.`);
        folderPathExam = await askForFolderPathExam();
    }

    
    let examFileName = await askForFile();
    let examFilePath = path.join(folderPathExam, examFileName);

    while (!fs.existsSync(examFilePath)) {
        console.log(`Le fichier d'examen "${examFileName}" n'existe pas dans le dossier.`);
        examFileName = await askForFile();
        examFilePath = path.join(folderPathExam, examFileName);
    }

    console.log(`Le fichier d'examen trouvé : ${examFilePath}`);

    
    const examProfile = analyzeQuestions(examFilePath);  
    const referenceProfile = analyzeQuestions(referenceFilePath);  

   
    console.log("\nComparaison des profils d'examen (Types de questions) :");
    const questionTypes = ['Choix multiples', 'Vrai/Faux', 'Correspondance', 'Mot manquant', 'Numérique', 'Questions ouvertes'];

    questionTypes.forEach(type => {
        console.log(`${type}:`);
        console.log(`  Examen: ${examProfile[type] || 0} - Référence: ${referenceProfile[type] || 0}`);
    });
}


module.exports = compareProfiles;
