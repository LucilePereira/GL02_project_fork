const fs = require('fs');
const path = require('path');
const readline = require('readline');


const extractAnswerBlock = (question) => {
    const answerBlockPattern = /(?:=|\~|\#|TRUE|FALSE|T|F|->)[^\n]*/g;
    const matches = (question.match(answerBlockPattern) || []).join(' ');
    return matches;
};


const detectQuestionType = (question) => {
    const answerBlock = extractAnswerBlock(question);

    if (answerBlock.includes('~') && answerBlock.includes('=')) {
        return 'QCM';
    }

    if (answerBlock.includes('->')) {
        return 'Corresp';
    }

    if (/^\s*(TRUE|FALSE|T|F)\b/i.test(answerBlock.trim())) {
        return 'V/F';
    }

    if (/^#|=\d+(:|..)/i.test(answerBlock)) {
        return 'Num';
    }

    if (/\{\}/.test(question)) {
        return 'Trous';
    }

    return 'QRO'; 
};


const analyzeQuestions = (filePath) => {
    if (fs.lstatSync(filePath).isDirectory()) {
        return {};
    }

    const content = fs.readFileSync(filePath, 'utf-8');

    const questions = {
        'QCM': 0,
        'QRO': 0,
        'V/F': 0,
        'Corresp': 0,
        'Num': 0,
        'Trous': 0,
    };

    const questionPattern = /::([^:]+)::([^{]+)\{([^\}]+)\}/g;
    let match;

    while ((match = questionPattern.exec(content)) !== null) {
        const question = match[0];
        const questionType = detectQuestionType(question);

        if (questions[questionType] !== undefined) {
            questions[questionType]++;
        }
    }

    return questions;
};

const generateTextHistogramComparison = (examData, referenceData, examFileName, referenceFileName) => {
    const maxCount = Math.max(...Object.values(examData), ...Object.values(referenceData));
    const scale = Math.max(10, maxCount); // Ajuster l'échelle
    const types = ['QCM', 'QRO', 'V/F', 'Corresp', 'Num', 'Trous'];

    console.log(`\nComparaison entre "${examFileName}" (gauche) et "${referenceFileName}" (droite)`);
    console.log('Nb de q°');

  
    for (let i = scale; i >= 0; i--) {
        const row = types
            .map((type) => {
                const examCount = examData[type] || 0;
                const refCount = referenceData[type] || 0;

                const leftBar = examCount >= i ? '|' : ' ';
                const rightBar = refCount >= i ? '|' : ' ';
                return `${leftBar} ${rightBar}`;
            })
            .join('   ');

        const prefix = i % 2 === 0 ? `${String(i).padStart(2, ' ')} |` : '   |';
        console.log(`${prefix} ${row}`);
    }

  
    console.log('   ' + '-'.repeat(types.length * 6 - 1));

   
    console.log('      ' + types.map(type => `${type.padEnd(5)}`).join('    '));
};

async function compareProfiles() {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        terminal: false,
    });

    const askQuestion = (query) => {
        return new Promise((resolve) => rl.question(query, resolve));
    };

    let folderPathReference = await askQuestion("\nChemin du dossier contenant le fichier de référence (ex : 'SujetA_data') : ");
    while (!fs.existsSync(folderPathReference) || !fs.lstatSync(folderPathReference).isDirectory()) {
        console.log(`Le chemin "${folderPathReference}" n'existe pas ou n'est pas un dossier valide.`);
        folderPathReference = await askQuestion("\nChemin du dossier contenant le fichier de référence : ");
    }

    let referenceFileName = await askQuestion("\nNom du fichier moyen de référence (ex : 'moyen.gift') : ");
    let referenceFilePath = path.join(folderPathReference, referenceFileName);

    while (!fs.existsSync(referenceFilePath)) {
        console.log(`Le fichier de référence "${referenceFileName}" n'existe pas dans le dossier.`);
        referenceFileName = await askQuestion("\nNom du fichier moyen de référence : ");
        referenceFilePath = path.join(folderPathReference, referenceFileName);
    }

    console.log(`Le fichier de référence trouvé : ${referenceFilePath}`);

    let folderPathExam = await askQuestion("\nChemin du dossier contenant le fichier d'examen (ex : 'SujetB_data') : ");
    while (!fs.existsSync(folderPathExam) || !fs.lstatSync(folderPathExam).isDirectory()) {
        console.log(`Le chemin "${folderPathExam}" n'existe pas ou n'est pas un dossier valide.`);
        folderPathExam = await askQuestion("\nChemin du dossier contenant le fichier d'examen : ");
    }

    let examFileName = await askQuestion("\nNom du fichier d'examen (ex : 'examen.gift') : ");
    let examFilePath = path.join(folderPathExam, examFileName);

    while (!fs.existsSync(examFilePath)) {
        console.log(`Le fichier d'examen "${examFileName}" n'existe pas dans le dossier.`);
        examFileName = await askQuestion("\nNom du fichier d'examen : ");
        examFilePath = path.join(folderPathExam, examFileName);
    }

    console.log(`Le fichier d'examen trouvé : ${examFilePath}`);

    const examProfile = analyzeQuestions(examFilePath);
    const referenceProfile = analyzeQuestions(referenceFilePath);

   
    generateTextHistogramComparison(examProfile, referenceProfile, examFileName, referenceFileName);

 
}





module.exports = compareProfiles;
