const fs = require('fs');
const path = require('path');
const inquirer = require('inquirer');


const detectQuestionType = (question) => {
    const answerBlock = extractAnswerBlock(question);

    if (answerBlock.includes('~') && answerBlock.includes('=')) return 'Choix multiples';
    if (answerBlock.includes('->')) return 'Correspondance';
    if (/^\s*(TRUE|FALSE|T|F)\b/i.test(answerBlock.trim())) return 'Vrai/Faux';
    if (/^#|=\d+(:|..)/i.test(answerBlock)) return 'Numérique';
    if (/\{\}/.test(question)) return 'Mot manquant';
    if (question.includes('?') && !answerBlock.includes('=') && !answerBlock.includes('~')) return 'Questions ouvertes';

    return 'Questions ouvertes';
};


const extractAnswerBlock = (question) => {
    const match = question.match(/\{([\s\S]*?)\}/);
    return match ? match[1].trim() : '';
};


const analyzeGiftFile = (filePath) => {
    try {
        const content = fs.readFileSync(filePath, 'utf-8').trim();

        if (!content) {
            console.warn(`Le fichier ${filePath} est vide.`);
            return null;
        }

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
    } catch (error) {
        console.error(`Erreur lors de la lecture du fichier ${filePath} :`, error.message);
        return null;
    }
};


const visualizeFileProfile = (filePath) => {
    const questionTypes = analyzeGiftFile(filePath);

    if (!questionTypes) return;

    console.log(`\nAnalyse du fichier : ${filePath}`);
    console.log('Type de questions détectées :');
    Object.entries(questionTypes).forEach(([type, count]) => {
        console.log(`  ${type.padEnd(20)}: ${count}`);
    });
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
        visualizeFileProfile(selectedFilePath);

       
        console.log("\nAnalyse terminée. Retour au menu principal...\n");
    } catch (error) {
        console.error('Erreur lors de la sélection ou de l\'analyse du fichier .gift :', error.message);
    }
};

if (require.main === module) {
    (async () => {
        
        await visualizeProfile('./SujetB_data');
    })();
}

module.exports = visualizeProfile;
