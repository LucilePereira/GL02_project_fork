const fs = require("fs");
async function simulTest() {
  const readline = require("readline").createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal:false
  });

  const askForFileName = () => {
    return new Promise((resolve) => {
      readline.question("\n Nom de l'examen à passer: ", (answer) => {
        resolve(answer);
      });
    });
  };

  const askForAnswer = () => {
    return new Promise((resolve) => {
        readline.question("Votre réponse : ", (answer) => {
           
          resolve(answer);
        });
    });
  };

  let reponse = await askForFileName(); 
  let cheminFile = "./examens/" + reponse + ".gift";
  //Vérifier si le nom donné existe ou non
  while (!fs.existsSync(cheminFile)) {
    console.log(`Le fichier "${reponse}.gift" n'existe pas. Veuillez entrer un nom valide.`);
    reponse = await askForFileName(); 
    cheminFile = "./examens/" + reponse + ".gift"; 
  }
  const fileContent = fs.readFileSync(cheminFile, "utf8");
  let tableauQuestions = fileContent.split("\n\n")


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

    tableauReponseU[i] = await askForAnswer()
    if(tableauReponseU[i]!=tableauBonnesReponses[i]){
      nbErreur ++
    }
    // je rajoute la possibilité au user de repondre ?? 
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

/*const fs = require("fs");

async function simulTest() {
  // Demander à l'utilisateur de saisir le nom du fichier d'examen
  const readline = require("readline").createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal:false
  });

  let i
  let nbErreur = 0 


  const askForFileName = () => {
    return new Promise((resolve) => {
      readline.question("\n Nom de l'examen à passer: ", (answer) => {
        resolve(answer);
      });
    });
  };

  const askForAnswer = () => {
    return new Promise((resolve) => {
        readline.question("Votre réponse : ", (answer) => {
            resolve(answer);
        });
    });
  };



  let reponse = await askForFileName(); 
  let cheminFile = "./examens/" + reponse + ".gift";
  //Vérifier si le nom donné existe ou non
  while (!fs.existsSync(cheminFile)) {
    console.log(`Le fichier "${reponse}.gift" n'existe pas. Veuillez entrer un nom valide.`);
    reponse = await askForFileName(); 
    cheminFile = "./examens/" + reponse + ".gift"; 
  }
  const fileContent = fs.readFileSync(cheminFile, "utf8");
  let tableauQuestions = fileContent.split("\n\n") // je split le fichier pour avoir un tableau de questions
  let tableauReponseU = [] // tableau qui va contenir les réponse de l utilisateur 
  let tableauBonnesReponses = []
  let tableauToutesReponses = []
  let tableau_Quniquement = []*/
  /*
  for(i=0; i<tableauQuestions.length -1 ; i++){
      
      tableau_Quniquement[i] = tableauQuestions[i].split(/\{[^}]*\}/g)
      console.log(tableau_Quniquement[i].join('\n'))
      const matches = tableauQuestions[i].match(/\{[^}]*\}/g);
  
    if (matches) { 
    //je stocke la bonne reponse qui possède un = dans le tableau tableauBonnesReponses
    const reponses = matches[0]
    .replace(/[{}]/g, '') 
    .split('\n') // 
    .map(line => line.trim());
    tableauToutesReponses[i] = reponses;
    tableauBonnesReponses[i] = tableauBonnesReponses[i] || [];
    reponses.forEach(reponse => {
      if (reponse.startsWith('=')) { // Vérifie si la réponse commence par '='
          tableauBonnesReponses[i].push(reponse.replace('=', '').trim());
      }
  });
    //Je stocke toutes les reponses possibles dans le tableau tableauToutesReponses en retirant { =-~} et si {} ne contient que =, je n affiche pas cette reponse, car ca affichera la bonne reponse directement 

    /*console.log('\n Réponse(s) : ')
    tableauToutesReponses[i] = tableauToutesReponses[i]
        .map(reponse => reponse.replace(/[~=-]/g, '').trim()) 
        .join('\n') */
    //console.log(tableauToutesReponses[i])
    /*if (reponses.length > 1 || !reponses[0].startsWith('=')) {
      console.log('\n Réponse(s) : ');
      tableauToutesReponses[i] = tableauToutesReponses[i]
        .map(reponse => reponse.replace(/[~=-]/g, '').trim())
        .join('\n');
      console.log(tableauToutesReponses[i] + ' ');
    }
    
  }
      //je stocke la reponse de l'utilisateur dans le tableau tableauReponseU
      tableauReponseU[i] = await askForAnswer()
       
      //je calcule le nombre de bonnes reponses : 
      if(tableauBonnesReponses[i] != tableauReponseU[i]){
        nbErreur ++ 
      }
*/
      //console.log("//////////////////////////////// \n ///////////////::::::::::")
     // afficheQuestion(tableauQuestions)

  //sortie de boucle = fin de l'examen  : affichage bilan exam */
/*
  console.log("Resultat du passage de l'examen \n")
  console.log("Nombre d'erreur : " + nbErreur + '\n')
  console.log("------Bilan des réponses------ \n")
  for(i=0; i<tableauQuestions.length - 1 ; i++){
  console.log(i+1 + ": \n"+ tableau_Quniquement[i] +'\n')
  console.log("Reponse donnée : " + tableauReponseU[i] + "  Bonne Reponse : " + tableauBonnesReponses[i] + '\n' ) }

*/
  
  


//}