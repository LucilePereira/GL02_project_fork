const fs = require('fs');
const path = require('path');
const inquirer = require('inquirer');


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

    const questionTypes = {
        QCM: 0,
        QRO: 0,
        'V/F': 0,
        Corresp: 0,
        Num: 0,
        Trous: 0,
    };

    const questions = content.match(/::.*?::.*?\{.*?\}/gs);

    if (questions) {
        questions.forEach((question) => {
            const type = detectQuestionType(question);
            if (type === 'Choix multiples') questionTypes.QCM++;
            if (type === 'Questions ouvertes') questionTypes.QRO++;
            if (type === 'Vrai/Faux') questionTypes['V/F']++;
            if (type === 'Correspondance') questionTypes.Corresp++;
            if (type === 'Numérique') questionTypes.Num++;
            if (type === 'Mot manquant') questionTypes.Trous++;
        });
    } else {
        console.warn(`Aucune question détectée dans le fichier ${filePath}.`);
    }

    return questionTypes;
};


const generateTextHistogram = (data, fileName) => {
    const maxCount = Math.max(...Object.values(data));
    const scale = Math.max(20, maxCount); // Ajuster l'échelle
    const types = ['QCM', 'QRO', 'V/F', 'Corresp', 'Num', 'Trous'];

    console.log(`Nom de l'examen: ${fileName}`);
    console.log('Nb de questions');

   
    for (let i = scale; i >= 0; i--) {
        const row = types
            .map((type) => {
                const count = data[type] || 0;
                return count >= i ? '|' : ' ';
            })
            .join('   ');

        const prefix = i % 2 === 0 ? `${String(i).padStart(2, ' ')} |` : '   |';
        console.log(`${prefix} ${row}`);
    }

    console.log('   ' + '-'.repeat(types.length * 4 - 1));
    console.log('     ' + types.join('   '));
};


const visualizeFileProfile = async (filePath) => {
    console.log(`Tentative d'analyse du fichier : ${filePath}`);
    const questionTypes = analyzeGiftFile(filePath);

    if (!questionTypes) return;

    console.log(`\nAnalyse du fichier : ${path.basename(filePath)}`);
    console.log('Type de questions détectées :');
    Object.entries(questionTypes).forEach(([type, count]) => {
        console.log(`  ${type.padEnd(10)}: ${count}`);
    });

  
    generateTextHistogram(questionTypes, path.basename(filePath));
};


const visualizeProfile = async (directoryPath = './SujetB_data') => {
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

        const answers = await inquirer.prompt([
            {
                type: 'list',
                name: 'file',
                message: 'Choisissez un fichier .gift à analyser :',
                choices: files,
            },
        ]);

        const selectedFilePath = path.join(directoryPath, answers.file);
        await visualizeFileProfile(selectedFilePath);
    } catch (error) {
        console.error('Erreur lors de la sélection ou de l\'analyse du fichier .gift :', error.message);
    }
};


const showMenu = async () => {
    while (true) {
        const answers = await inquirer.prompt([
            {
                type: 'list',
                name: 'action',
                message: 'Que voulez-vous faire ?',
                choices: ['Visualiser un fichier .gift', 'Quitter'],
            },
        ]);

        switch (answers.action) {
            case 'Visualiser un fichier .gift':
                await visualizeProfile();
                break;
            case 'Quitter':
                console.log('Au revoir !');
                process.exit(0); 
        }
    }
};


if (require.main === module) {
    showMenu();
}



module.exports = visualizeProfile;