const fs = require('fs');
const path = require('path');
const readline = require('readline');


async function askQuestion(query) {
    let rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        terminal: false,
    });
    let answer = await new Promise((resolve) => rl.question(query, resolve));
    rl.close();
    return answer;
}

async function askAndTryFile(message) {
    let extension = ".gift"
    let filePath = await askQuestion(message);
    let answer = {};

    while (path.extname(filePath) !== extension) {
        // Verifier que le fichier est bien un .gift
        if(path.extname(filePath) !== extension){
            console.log(`Le fichier "${filePath}" n'est pas un fichier ${extension}. `);
            filePath = await askQuestion(message);
        }
    }
    
    answer.path = filePath;
    answer.exists = fs.existsSync("./" + filePath);
    return answer;
}

async function askAndOpenFile(message = "\nChemin du fichier d'examen (ex : 'examens/e/examen.gift') : ") {
    let extension = ".gift";
    let filePath = await askQuestion(message);
    let file = undefined;
    let answer = {};

    while (!fs.existsSync(filePath) || path.extname(filePath) !== extension || file === undefined) {
        // Verifier que le fichier est bien un .gift
        if(path.extname(filePath) !== extension){
            console.log(`Le fichier "${filePath}" n'est pas un fichier ${extension}. `);
            filePath = await askQuestion(message);
        }
        
        // Verifier que le fichier existe
        else if(!fs.existsSync(filePath)){
            console.log(`Le fichier "${filePath}" n'existe pas.`);
            filePath = await askQuestion(message);
        }
        
        else{
            file = await openFile(filePath);
        }
    }
    
    answer.path = filePath;
    answer.data = file;
    return answer;
}

async function askAndOpenDirectory(message = "\nChemin du répertoire contenant les examens (ex : 'examens/e/') : ") {
    let dirPath = await askQuestion(message);
    let dir = undefined;
    let answer = {};

    while (!fs.existsSync(dirPath) || dir === undefined) {
        // Verifier que le repertoire existe
        if(!fs.existsSync(dirPath)){
            console.log(`Le répertoire "${dirPath}" n'existe pas.`);
            dirPath = await askQuestion(message);
        }
        else {
            dir = await openDirectory(dirPath);
        }    
    }
    
    answer.path = dirPath;
    answer.data = dir;
    return answer;
}

function openFile(filePath) {
    // Verifier que le fichier existe
    if(!fs.existsSync(filePath)){
        return;
    }
    if (fs.lstatSync(filePath).isDirectory()) {
        return;
    }
    
    try {
        data = fs.readFileSync(filePath, 'utf8');
    } catch (error) {
        console.error("Une erreur est survenue lors de la lecture du fichier : " + error.message);
    }
    
    return data;
}

function openDirectory(dirPath) {
    let data;
    // Verifier que le repertoire existe
    if(!fs.existsSync(dirPath)){
        return;
    }
    
    try {
        data = fs.readdirSync(dirPath, 'utf8');
    } catch (error) {
        console.error("Une erreur est survenue lors de la lecture du répertoire : " + error.message);
    }
    
    return data;
}

module.exports = {askQuestion, askAndTryFile, askAndOpenFile, askAndOpenDirectory, openFile, openDirectory};
