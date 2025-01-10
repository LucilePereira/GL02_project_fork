const {askAndOpenFile} = require("./askAndOpen.js");
const {askQuestion} = require("./askAndOpen.js");

async function simulTest() {
  let file = await askAndOpenFile(); 
  let tableauQuestions = file.data.split("\n\n")

  let tableauReponseU = []
  let tableauBonnesReponses = []
  let nbErreur = 0 
  for (var i = 0; i < tableauQuestions.length - 1; i++) {
    const exo = tableauQuestions[i].split("::");
    let rep = exo[exo.length - 1].match(/\{[^}]*\}/g);
    if (rep) {
      rep = rep.map((elt) => {
        var ans = elt
          .substring(1, elt.length - 1)
          .split(/(~=|=|~)/)
          //.filter(part => !part.includes('~') && !part.includes('=') && part!==" \n")
          .slice(1);
        //.join("\n ")
        var isRep = false;
        let nRep = 0;
        ans = ans.map((elt2) => {
          if (isRep) {
            nRep++;
            isRep = false;
            tableauBonnesReponses[i] = elt2.replace("\n", "")
            return nRep + ". " + elt2.replace("\n", "") ;

          }
          if (elt2.includes("=") || elt2.includes("~=")) {
            isRep = true;
            return;
          }
          if (elt2 === " \n" || elt2 === " " || elt2.includes("~")) {
            return;
          }
          nRep++;
          return nRep + ". " + elt2.replace("\n", "");
        });
        return ans.join("\n");
      });
    }
    console.log(
      "\n " +
        "Titre : " +
        exo[1] +
        "\nConsigne: " +
        tableauQuestions[i].split("|||")[0] +
        "\n" +
        exo[exo.length - 1].split(/\{[^}]*\}/g).join("YOUR ANSWER") +
        "\n-----------------Réponses-------------- " +
        (rep?.join("\n") || "\npas de réponse")
    );

    tableauReponseU[i] = await askQuestion("Bien vouloir ecrire entierement la réponse en toute lettre : ");
    if(tableauReponseU[i]!=tableauBonnesReponses[i]){
      nbErreur ++
    }
  }
  console.log("\n Resultat du passage de l'examen \n")
  console.log("Nombre d'erreur : " + nbErreur + '\n')
  console.log("------Bilan des réponses------ \n")
  for (var i = 0; i < tableauQuestions.length - 1; i++) {
    const exo = tableauQuestions[i].split("::");
    let rep = exo[exo.length - 1].match(/\{[^}]*\}/g);
    if (rep) {
      rep = rep.map((elt) => {
        var ans = elt
          .substring(1, elt.length - 1)
          .split(/(~=|=|~)/)
          //.filter(part => !part.includes('~') && !part.includes('=') && part!==" \n")
          .slice(1);
        //.join("\n ")
        var isRep = false;
        let nRep = 0;
        ans = ans.map((elt2) => {
          if (isRep) {
            nRep++;
            isRep = false;
            tableauBonnesReponses[i] = elt2.replace("\n", "")
            return nRep + ". " + elt2.replace("\n", "") ;

          }
          if (elt2.includes("=") || elt2.includes("~=")) {
            isRep = true;
            return;
          }
          if (elt2 === " \n" || elt2 === " " || elt2.includes("~")) {
            return;
          }
          nRep++;
          return nRep + ". " + elt2.replace("\n", "");
        });
        return ans.join("\n");
      });
    }
    console.log(
      "\n " +
        "Titre : " +
        exo[1] +
        "\nConsigne: " +
        tableauQuestions[i].split("|||")[0] +
        "\n" +
        exo[exo.length - 1].split(/\{[^}]*\}/g).join("YOUR ANSWER"))
  console.log("Reponse donnée : " + tableauReponseU[i] + "  Bonne Reponse : " + tableauBonnesReponses[i] + '\n' ) }
}

module.exports = simulTest;
