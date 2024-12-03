const fs = require("fs");

describe("Test 3e spec du cahier des charges", function () {
  beforeAll(function () {
    const { addQuestion } = require("../libs/searchQuestion");
    this.searchAddQuestion = searchAddQuestion;
  });

  xit("Test ajout question fichier exam", async function () {
    let files = await fs.promises.readdir("./examens");
    const formerLen = files.length;

    let fileCharCount = {};
    fs.readdirSync("./examens").forEach((file) => {
      fs.readFileSync("./examens/" + file, (err, data) => {
        fileCharCount.file = data.length;
      });
    });
    this.searchAddQuestion();

    let hasChanged = [];
    fs.readdirSync("./examens").forEach((file) => {
      fs.readFileSync("./examens/" + file, (err, data) => {
        if (Object.values(fileCharCount).includes(file)) {
          if (data.length != fileCharCount.file.length) {
            hasChanged.add(true);
          } else {
            hasChanged.add(false);
          }
        }
      });
    });
    expect(hasChanged.length).toBeLessThan(
      Object.values(fileCharCount).length + 2
    ); //vérifie que 2 fichier n'ont pas été créé
    expect(
      !hasChanged.every((value) => value === false) &&
        hasChanged.length != Object.values(fileCharCount).length
    ).toEqual(false); //vérifie qu'aucun des fichier existants a été modif si un fichier a été créé ou que un fichier n'a pas été créé si un fichier a été modif
  });
});
