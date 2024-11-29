const fs = require('fs');
const path = require('path');


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
    const content = fs.readFileSync(filePath, 'utf-8');

    // Initialisation 
    const questionTypes = {
        'Choix multiples': 0,
        'Vrai/Faux': 0,
        'Correspondance': 0,
        'Numérique': 0,
        'Mot manquant': 0, 
        'Questions ouvertes': 0,
    };

    const questions = content.match(/::.*?::.*?\{.*?\}/gs);

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


const analyzeExam = (directoryPath = './SujetB_data') => {
    try {
        if (!fs.existsSync(directoryPath)) {
            console.error(`Erreur : Le répertoire "${directoryPath}" n'existe pas.`);
            return;
        }

        const files = fs.readdirSync(directoryPath).filter((file) => file.endsWith('.gift'));

        if (files.length === 0) {
            console.log('Aucun fichier .gift trouvé dans le répertoire.');
            return;
        }

        console.log(`Analyse des fichiers .gift dans "${directoryPath}"...\n`);

        const totalQuestionTypes = {
            'Choix multiples': 0,
            'Vrai/Faux': 0,
            'Correspondance': 0,
            'Numérique': 0,
            'Mot manquant': 0,
            'Questions ouvertes': 0,
        };

        files.forEach((file) => {
            const filePath = path.join(directoryPath, file);
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
    } catch (error) {
        console.error('Erreur lors de l’analyse des fichiers .gift :', error.message);
    }
};

// Exécution directe 
if (require.main === module) {
    analyzeExam('./SujetB_data');
}

module.exports = analyzeExam;
