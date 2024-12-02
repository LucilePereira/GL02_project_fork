const fs = require("fs");

describe("Test première spec du cahier des charges", function(){
    beforeAll(function(){
        this.createExamFile = require('../libs/create_exam_file')
    })
    
    it("Test création de fichier",async function(){
        let files = await fs.promises.readdir("./examens");
        const formerLen=files.length
        await this.createExamFile()
        files = await fs.promises.readdir("./examens");
        expect(files.length).toEqual(formerLen+1)
    })
})