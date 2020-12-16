const joursSemaine = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];


let ajd = new Date();
let options = {weekday: 'long'};
let jourActuel = ajd.toLocaleDateString('fr-FR', options); // jour actuel en français
console.log(jourActuel, ajd);

jourActuel = jourActuel.charAt(0).toUpperCase() + jourActuel.slice(1); // M+ ercredi

let tabJoursEnOrdre = joursSemaine.slice(joursSemaine.indexOf(jourActuel)).concat(joursSemaine.slice(0, joursSemaine.indexOf(jourActuel))); //on recolle ce qui manque depuis dimanche
console.log(tabJoursEnOrdre);

export default tabJoursEnOrdre;