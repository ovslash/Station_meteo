let villeCoordonees = null; // Variable pour pouvoir stockeer les coordonnées de la ville

function coordoneesVille(ville) {
  if (villeCoordonees) {
    return Promise.resolve(villeCoordonees);
  } else {
    // Récuperation de la position d'une ville
    return fetch(
      `https://api.openweathermap.org/geo/1.0/direct?q=${ville},fr&limit=1&appid=7f0cf71b80917549291aa9e7d834fc02`
    )
      .then((response) => response.json())
      .then((data) => {
        const { lat, lon } = data[0];
        villeCoordonees = { lat, lon };
        return villeCoordonees;
      });
  }
}

function donneesMeteo() {
  fetch("conf.json")
    .then((response) => response.json())
    .then((data) => {
      const ville = data.ville;
      return coordoneesVille(ville); // Appel de la fonction pour obtenir les coordonnées
    })
    .then(({ lat, lon }) => {
      // Récuperation et affichage des données
      return fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&lang=fr&units=metric&appid=7f0cf71b80917549291aa9e7d834fc02`
      );
    })
    .then((response) => response.json())
    .then((data) => {
      // Affichage des données
      document.getElementById("temperature").textContent = `${Math.round(
        data.main.temp
      )}°C`;
      document.getElementById(
        "temperature-ressentie"
      ).textContent = `${Math.round(data.main.feels_like)}°C`;
      document.getElementById(
        "description"
      ).textContent = `${data.weather[0].description}`;
      document.getElementById("lieu").textContent = `${data.name}`;
      document.getElementById(
        "humidite"
      ).textContent = `${data.main.humidity}%`;

      // Icone
      const icone = data.weather[0].icon;
      const urlImage = `https://openweathermap.org/img/wn/${icone}@2x.png`;
      document.getElementById("image-temps").src = urlImage;

      // Heure d'actualisation
      var heureExecution = new Date();
      var heureExecutionString = heureExecution.toLocaleTimeString();
      document.getElementById("heure").textContent = heureExecutionString;
    })
    .catch((error) => console.error(error));
}

donneesMeteo();

// Raffraichissement toutes les heures
setInterval(donneesMeteo, 3600000); // 3600000 ms pour 1 heure - 10000 ms pour tester 10 s
