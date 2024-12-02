const fs = require("fs");

describe("Test deuxieme spec du cahier des charges", function () {
  beforeAll(function () {
    const { getQuestionsWkeyword } = require("../libs/searchQuestion");
    const { getQuestionWCateg } = require("../libs/searchQuestion");
    this.getQuestionsWkeyword = getQuestionsWkeyword;
    this.getQuestionWCateg = getQuestionWCateg;
    this.getCategorieQuestion = require("../libs/categorieQuestion");
  });

  it("Test rechercher une question avec un mot clé", function () {
    var questionsWKeywords = this.getQuestionsWkeyword("./examens", "computer");
    for (let question of questionsWKeywords) {
      expect(question.toLowerCase().includes("computer")).toEqual(true);
    }
  });
  it("Test rechercher une question par catégorie", function () {
    let categs = [
      "pas de réponse",
      "correspondance",
      "mot manquant",
      "vrai faux",
      "choix multiple",
      "question ouverte",
    ];

    for (let categ of categs) {
      var questionsWCateg = this.getQuestionWCateg("./SujetB_data", [categ]);
      for (let question of questionsWCateg) {
        expect(this.getCategorieQuestion(question.split("|||")[1])).toEqual(
          categ
        ); // le .split permet d'extraire la question qui est groupé avec la consigne au retour de getQuestionWCateg
      }
    }
  });
});
