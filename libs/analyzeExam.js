const path = require('path');
const {openFile} = require('./askAndOpen.js');
const {askAndOpenDirectory} = require('./askAndOpen.js');


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


const extractAnswerBlock = (question) => {
    const match = question.match(/\{([\s\S]*?)\}/);
    return match ? match[1].trim() : '';
};



const analyzeGiftFile = (filePath) => {
    const file = openFile(filePath);
    
    // Initialisation 
    const questionTypes = {
        'Choix multiples': 0,
        'Vrai/Faux': 0,
        'Correspondance': 0,
        'Numérique': 0,
        'Mot manquant': 0, 
        'Questions ouvertes': 0,
    };

    const questions = file.match(/::.*?::.*?\{.*?\}/gs);

    if (questions) {
        questions.forEach((question) => {
            const type = detectQuestionType(question);
            questionTypes[type]++;
        });
    } else {
        console.warn(`Aucune question détectée dans le fichier ${filePath}.`);
    }

    return questionTypes;
};


const analyzeExam = async () => {
    let directory = await askAndOpenDirectory();
    const files = directory.data.filter((file) => file.endsWith('.gift'));

    if (files.length === 0) {
        console.log('Aucun fichier .gift trouvé dans le répertoire.');
        return;
    }

    console.log(`Analyse des fichiers .gift dans "${directory.path}"...\n`);

    const totalQuestionTypes = {
        'Choix multiples': 0,
        'Vrai/Faux': 0,
        'Correspondance': 0,
        'Numérique': 0,
        'Mot manquant': 0,
        'Questions ouvertes': 0,
    };

    files.forEach((file) => {
        const filePath = path.join(directory.path, file);
        const questionTypes = analyzeGiftFile(filePath);

        console.log(`Fichier : ${file}`);
        Object.entries(questionTypes).forEach(([type, count]) => {
            console.log(`  ${type.padEnd(20)}: ${count}`);
            totalQuestionTypes[type] += count;
        });
        console.log();
    });

    console.log('--- Résumé global ---');
    Object.entries(totalQuestionTypes).forEach(([type, count]) => {
        console.log(`${type.padEnd(20)}: ${count}`);
    });
    console.log();
};

module.exports = analyzeExam;

if (require.main === module) {
    main();
}
