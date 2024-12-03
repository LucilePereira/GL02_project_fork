const fs = require("fs");

describe("Test première spec du cahier des charges", function () {
  beforeAll(function () {
    this.createExamFile = this.createExamFile;
    const { checkFileName, createFile } = require("../libs/create_exam_file");
    this.checkFileName = checkFileName;
    this.createFile = createFile;
  });

  it("Test création de fichier : test nom + enregistrement", async function () {
    const nomFile = Math.random().toString();
    expect(await this.checkFileName(nomFile)).toEqual(true);
    let files = await fs.promises.readdir("./examens");
    const formerLen = files.length;
    console.log(files[0])
    expect(await this.checkFileName(files[0].slice(0,-5))).toEqual(false);

    //l'enregistrer
    await this.createFile(nomFile);
    files = await fs.promises.readdir("./examens");
    expect(files.length).toEqual(formerLen + 1);
  });
});
