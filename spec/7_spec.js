const fs = require("fs");
const path = require("path");

describe("Vérification des fichiers .gift dans le répertoire examens", function () {
  beforeAll(function () {
    this.examDir = path.join(__dirname, "../examens");
  });

  it("devrait trouver des fichiers .gift dans le répertoire examens", async function () {
    console.log("Début du test spec 7...");
    // Lire les fichiers dans le répertoire
    let files = await fs.promises.readdir(this.examDir);

    // Filtrer les fichiers pour obtenir ceux avec l'extension .gift
    const giftFiles = files.filter(file => file.endsWith(".gift"));

    console.log("Des Fichiers .gift trouvés ");
    expect(giftFiles.length).toBeGreaterThan(0);
  });
   });