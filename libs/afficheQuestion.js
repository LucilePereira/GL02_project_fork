function afficheQuestion(questionsWKeywords) {
  /*
    //{blabla} : question ouverte
    {blabl->abla} : question fermé, correspondance
    {~bla~=/=bla} : question fermée, choix unique
    //{MC}:question fermé,choix unique
    //{=...=...~...}(plusieurs égales) : question fermé, choix multiple
    //{...\n...\n...} : question fermé
    {=...=...=...} : question ouverte, mot manquant
    //{=mot} : question ouverte, mot manquant
    {1:SA:blabla} : mot manquant, question ouverte
    blablabal : question ouverte
    {~%50/100%blabla~pareil} : une des deux rep (ou les deux) correcte, question fermé
    {} : pas de rep
    */
  console.log("Questions trouvées : \n");
  for (var i = 0; i < questionsWKeywords.length; i++) {
    const exo = questionsWKeywords[i].split("::");
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
            return nRep + ". " + elt2.replace("\n", "") + " - Bonne réponse";
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
        i +
        ".\n" +
        "Titre : " +
        exo[1] +
        "\nConsigne: " +
        questionsWKeywords[i].split("|||")[0] +
        "\n" +
        exo[exo.length - 1].split(/\{[^}]*\}/g).join("VOTRE REPONSE") +
        "\n-----------------Réponses-------------- " +
        rep?.join("\n")
    );
  }
}
module.exports = afficheQuestion;
