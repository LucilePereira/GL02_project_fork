const fs = require("fs");
const path = require("path");

describe("Vérification des questions dans les examens", function () {
  beforeAll(function () {
    this.examDir = path.join(__dirname, "../examens");
  });

  it("devrait détecter correctement le type de question à partir des fichiers .gift", async function () {
    console.log("Début du test spec 6...");
    const giftFiles = await fs.promises.readdir(this.examDir);
    const files = giftFiles.filter(file => file.endsWith(".gift"));
    

    for (const file of files) {
      const filePath = path.join(this.examDir, file);
      const content = await fs.promises.readFile(filePath, 'utf-8');
      

      
      const questions = content.match(/::[^:]+::[^{}]+\{[^}]*\}/gs);  

      if (questions) {
        questions.forEach((question) => {
          console.log(`Fichier : ${file} `);
          
          if (question.includes('~') && question.includes('=')) {
            console.log("Type de question détecté : Choix multiples");
            expect(question).toMatch(/~.*=/); 
          } else if (question.includes('->')) {
            console.log("Type de question détecté : Correspondance");
            expect(question).toMatch(/->/);
          } else if (/^\s*(TRUE|FALSE|T|F)\b/i.test(question.trim())) {
            console.log("Type de question détecté : Vrai/Faux");
            expect(question).toMatch(/TRUE|FALSE|T|F/i);
          } else if (/^#|=\d+(:|..)/i.test(question)) {
            console.log("Type de question détecté : Numérique");
            expect(question).toMatch(/#|=\d+/);
          } else if (/\{\}/.test(question)) {
            console.log("Type de question détecté : Mot manquant");
            expect(question).toMatch(/\{\}/);
          } else if (question.includes('?') && !question.includes('=') && !question.includes('~')) {
            console.log("Type de question détecté : Questions ouvertes");
            expect(question).toMatch(/\?/);
          }
        });
      } else {
        console.warn(`Aucune question détectée dans le fichier ${file}`);
      }
    }
  });

});
