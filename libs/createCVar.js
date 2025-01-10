const fs = require("fs");
const {askQuestion} = require("./askAndOpen.js");


async function createCVar() {

  // Demander à l'utilisateur de saisir le nom du fichier 
  const readline = require("readline").createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal:false
  });
  
  //fonction qui verifie si le fichier nom_prenom existe deja a partir des noms et prenoms donnés 
  async function askValidName() {
    let nom, prenom, fileName;
    while (true) {
      nom = await askQuestion("Saisissez votre nom : ");
      prenom = await askQuestion("Saisissez votre prénom : ");
      fileName = `./Vcard_files/${nom}_${prenom}.cvr`;

      if (fs.existsSync(fileName)) {
        console.log(`Le profil ${nom} ${prenom} existe déjà ! Veuillez saisir un autre nom et prénom.`);
      } else {
        break; // Si le fichier n'existe pas, on sort de la boucle
      }
    }
    return { nom, prenom };
  }

  const { nom, prenom } = await askValidName();


  //fonction qui verifie si le format de l adresse mail est correcte
  function isValidEmail(email) {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  }



  let mail;
  while (true) {
    mail = await askQuestion("Saisissez votre adresse mail : ");
    if (isValidEmail(mail)) {
      break; 
    } else {
      console.log("Adresse email invalide. Veuillez saisir une adresse valide.");
    }
  }
  const matiere = await askQuestion ("Saisissez les matières que vous enseignez (séparées d'une virgule !) : ")
  const etablissement = await askQuestion ("Saisissez les établissements dans lesquels vous enseignez (séparés d'une virgule !) : ")
  const listetablissement = etablissement.split(",").map((etablissement) => etablissement.trim()).join(";");
    const listMatiere = matiere.split(",").map((matiere) => matiere.trim()).join(";");

  const vCardContent = [
"BEGIN:VCARD",
      "VERSION:4.0",
      `FN:${prenom} ${nom}`, 
      `NOM:${nom}`,
      `PRENOM:${prenom}`, 
      `EMAIL:${mail}`, 
      `MATIERES ENSEIGNEES:${listMatiere}`,
      `ETABLISSEMENTS:${listetablissement}`,
      "END:VCARD"]

const vCardString = vCardContent.join("\r\n");
const fileName = `./Vcard_files/${nom}_${prenom}.cvr`;
fs.writeFileSync(fileName, vCardString.trim());
    console.log(`Le fichier ${nom}_${prenom}.cvr a été créé avec succès !`)
}
module.exports = createCVar;
