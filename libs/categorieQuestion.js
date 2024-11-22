function getCategorieQuestion(question) {

  const regexCorrespondance = /\{([^}]*)->([^}]*)\}/g;
  const regexMotManquant1 = /\{(([^}~]*)(=)([^}~]*))*\}/;
  const regexMotManquant2 = /\{(1:SA:[^}]*)\}/;
  const regexVraiFaux = /\{([^}]*~%(50|100)%([^}]*))*\}/;
  const regexChoixMultiple = /\{(([^}]*)(=)([^}]*))*\}/;
  const regexPasDeRep = /\{\}/;
  if (question.match(regexPasDeRep)) {
    return "pas de réponse";
  }
  if (question.match(regexCorrespondance)) {
    return "correspondance";
  }
  if (question.match(regexMotManquant1) || question.match(regexMotManquant2)) {
    return "mot manquant";
  }
  if (question.match(regexVraiFaux)) {
    return "vrai faux";
  }
  if (question.match(regexChoixMultiple)) {
    return "choix multiple";
  }
  
  return "question ouverte";
}
module.exports = getCategorieQuestion;
