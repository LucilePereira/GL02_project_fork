const {askAndOpenFile} = require('./askAndOpen.js');


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


const analyzeQuestions = (content) => {
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

    let referenceFile = await askAndOpenFile("\nNom du fichier moyen de référence (ex : 'moyen.gift') : ");
    console.log(`Le fichier de référence trouvé : ${referenceFile.path}`);
    

    let examFile = await askAndOpenFile("\nNom du fichier d'examen (ex : 'examen.gift') : ");
    console.log(`Le fichier d'examen trouvé : ${examFile.path}`);

    const examProfile = analyzeQuestions(examFile.data);
    const referenceProfile = analyzeQuestions(referenceFile.data);
   
    generateTextHistogramComparison(examProfile, referenceProfile, examFile.path, referenceFile.path); 
}

module.exports = compareProfiles;
