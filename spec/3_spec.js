const fs = require("fs");

describe("Test 3e spec du cahier des charges", function () {
  beforeAll(function () {
    const { addQuestionToFile } = require("../libs/searchQuestion");
    const { getQuestionWCateg } = require("../libs/searchQuestion");
    this.addQuestionToFile = addQuestionToFile;
    this.getQuestionWCateg = getQuestionWCateg;
  });

  xit("Test création fichier exam via ajout question", async function(){

  })

  it("Test ajout question fichier exam existant", async function () {
    const questionsSelected = this.getQuestionWCateg("./SujetB_data", [
      "correspondance",
      "vrai faux",
      "choix multiple",
    ]);
    let fileCharCount = {};

    // Lire le répertoire de manière synchrone
    let files = fs.readdirSync("./examens");
    
    // Parcourir chaque fichier dans le répertoire
    files.forEach((file) => {
      // Lire le contenu du fichier de manière synchrone
      const data = fs.readFileSync("./examens/" + file, 'utf8');
    
      // Stocker le nombre de caractères dans l'objet fileCharCount
      fileCharCount[file] = data.length;
    });
    this.addQuestionToFile(Object.keys(fileCharCount)[0],0,questionsSelected);

    let hasChanged = [];
    const fsPromises = fs.promises;
    files = await fsPromises.readdir("./examens");
    for (const file of files) {
        const data = await fsPromises.readFile("./examens/" + file, 'utf8');
        if (Object.keys(fileCharCount).includes(file)) {
            if (data.length !== fileCharCount[file]) {
                hasChanged.push(true);
            } else {
                hasChanged.push(false);
            }
        }
    }
    expect(hasChanged.length).toEqual(
      Object.keys(fileCharCount).length
    ); 
    const trueCount = hasChanged.filter(item => item === true).length;
    expect(trueCount).toEqual(1);
  });
});
