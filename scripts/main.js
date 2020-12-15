import tabJoursEnOrdre from './Utilitaire/gestionTemps.js';

// console.log("DEPUIS MAIN JS:" + tabJoursEnOrdre);

const CLEFAPI = '05806546078a774ef25d7971e2f037be';
let resultatsAPI;

const temps = document.querySelector('.temps');
const temperature = document.querySelector('.temperature');
const localisation = document.querySelector('.localisation');
const heure = document.querySelectorAll('.heure-nom-prevision');
const tempPourH = document.querySelectorAll('.heure-prevision-valeur');
const joursDiv = document.querySelectorAll('.jour-prevision-nom');
const tempJoursDiv = document.querySelectorAll('.jour-prevision-temp');
const imgIcone = document.querySelector('.logo-meteo');
const chargementContainer = document.querySelector('.overlay-icone-chargement');
//test pull
if(navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(position => {
        //console.log(position);

        let long = position.coords.longitude;
        let lat = position.coords.latitude;
        
        AppelAPI(long,lat, undefined);

    }, () => {
        alert(`Vous avez refusé la géolocalisation, souhaitez-vous sélectionner manuellement une ville ?`);
        let choix = prompt("Par quel moyen souhaitez vous identifier la ville ?", "<Saisissez ville ou coordonnées GPS>");
        if (choix == null){
            alert("Vous avez cliqué sur Annuler");
        }
        else if (choix == "" || (choix != "ville" && choix != "coordonnées GPS") ){
            alert("Choix vide ou saisie incorrecte");
        }
        else if (choix == 'coordonnées GPS'){
            var long = prompt("Quelle est la longitutde de la ville souhaitée?", "<Entrez ici la longitude>");
            if( long == null ){
                alert("Vous avez cliqué sur Annuler");
            }
            else {
                while (long == "" || long == "<Entrez ici la longitude>"){
                    alert("Champs vide; veuillez recommencer");
                    long = prompt("Quelle est la longitutde de la ville souhaitée?", "<Entrez ici la longitude>");
                }
                var lat = prompt("Quelle est la latitude de la ville souhaitée?", "<Entrez ici la latitude>");
                if( lat == null ){
                    alert("Vous avez cliqué sur Annuler");
                }
                else {
                    while (lat == "" || lat == "<Entrez ici la latitude>"){
                        alert("Champs vide; veuillez recommencer")
                        lat = prompt("Quelle est la latitude de la ville souhaitée?", "<Entrez ici la latitude>");
                    }
                    let ville = "ville pas encore def à partir long lat";
                    AppelAPI(long,lat,undefined);
                }
            }
        }
        else { //(choix == 'ville')
            var ville = prompt("Quelle est la ville souhaitée?", "<Entrez ici le nom de la ville>");
            console.log("ville saisie : " + ville);
            AppelAPI_city(ville);
        }
    }
    )}
        
function AppelAPI(long, lat, ville) {
    //console.log(long);
    //console.log(lat);
    fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${long}&exclude=minutely&units=metric&lang=fr&appid=${CLEFAPI}`)
    .then((reponse) => {
        return reponse.json();
    })
    .then((data) => {
        console.log(data);

        resultatsAPI = data;

        temps.innerText = resultatsAPI.current.weather[0].description; //exemple : Nuageux
        console.log("temps : " + resultatsAPI.current.weather[0].description);
        temperature.innerText = `${Math.trunc(resultatsAPI.current.temp)}°`
        if (ville != undefined){
            localisation.innerText = resultatsAPI.timezone + " " + ville; //Fuseau horaire
        } else {
            localisation.innerText = resultatsAPI.timezone;
        }
        console.log("localisation : "+ resultatsAPI.timezone);
        console.log(resultatsAPI.name);

        // les heures, par tranche de trois, avec leur temperature.

        let heureActuelle = new Date().getHours();

        for(let i = 0; i < heure.length; i++) {

            let heureIncr = heureActuelle + i * 3;

            if(heureIncr > 24) {
                heure[i].innerText = `${heureIncr - 24} h`;
            } else if(heureIncr === 24) {
                heure[i].innerText = "00 h"
            } else {
                heure[i].innerText = `${heureIncr} h`;
            }

        }

        // temp pour 3h
        for(let j = 0; j < tempPourH.length; j++) {
            tempPourH[j].innerText = `${Math.trunc(resultatsAPI.hourly[j * 3].temp)}°`
        }


        // trois premieres lettres des jours 

        for(let k = 0; k < tabJoursEnOrdre.length; k++) {
            joursDiv[k].innerText = tabJoursEnOrdre[k].slice(0,3);
        }


        // Temps par jour
        for(let m = 0; m < 7; m++){
            tempJoursDiv[m].innerText = `${Math.trunc(resultatsAPI.daily[m + 1].temp.day)}°`
        }

        // Icone dynamique 
         if(heureActuelle >= 6 && heureActuelle < 21) {
             imgIcone.src = `ressources/jour/${resultatsAPI.current.weather[0].icon}.svg`
         } else  {
            imgIcone.src = `ressources/nuit/${resultatsAPI.current.weather[0].icon}.svg`
         }


         chargementContainer.classList.add('disparition');

    })

}
function AppelAPI_city(city) {
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${CLEFAPI}`)
    .then((reponse) => {
        return reponse.json();
    })
    .then((data) => {
        console.log(data);

        resultatsAPI = data;
        var long = resultatsAPI.coord.lon;
        var lat = resultatsAPI.coord.lat;
        var ville = resultatsAPI.name;
        console.log(long);
        console.log(lat);
        console.log(resultatsAPI.name);
        AppelAPI(long,lat,ville);

    }) 

}
function nouvelleSaisie(){
    alert('ok');
}