let pokemons = []; // Déclare la variable globalement

// Charger le fichier JSON
fetch('./data/pokebuildAPI.json')
  .then(response => {
    if (!response.ok) {
      throw new Error('Erreur lors du chargement des données');
    }
    return response.json();
  })
  .then(data => {
    pokemons = data; // Remplit la variable avec les données
    console.log('Données chargées:', pokemons);

    // Initialise l'écouteur de la barre de recherche
    initSearchListener();
  })
  .catch(error => {
    console.error('Erreur :', error);
  });

let currentPokemonId = null; // Suivi de l'ID du Pokémon actuellement affiché

function initSearchListener() {
  // Barre de recherche
  document.getElementById('pokemon-search').addEventListener('input', (event) => {
    const query = event.target.value.trim().toLowerCase();

    // Recherche par ID ou nom
    const result = pokemons.find(pokemon =>
      pokemon.id === parseInt(query) || pokemon.name.toLowerCase() === query
    );

    if (result) {
      displayPokemon(result);
    } else if (query) {
      document.getElementById('pokemon-details').innerHTML = '<p>Aucun Pokémon trouvé.</p>';
    }
  });

  // Gestion des flèches directionnelles
  document.addEventListener('keydown', (event) => {
    if (currentPokemonId === null) return;

    if (event.key === 'ArrowRight') {
      const nextPokemon = pokemons.find(pokemon => pokemon.id === currentPokemonId + 1);
      if (nextPokemon) {
        displayPokemon(nextPokemon);
      }
    } else if (event.key === 'ArrowLeft') {
      const prevPokemon = pokemons.find(pokemon => pokemon.id === currentPokemonId - 1);
      if (prevPokemon) {
        displayPokemon(prevPokemon);
      }
    }
  });

    // Gestion des flèches cliquables (HTML)

    function navigateToNextPokemon() {
      const nextPokemon = pokemons.find(pokemon => pokemon.id === currentPokemonId + 1);
      if (nextPokemon) {
        displayPokemon(nextPokemon);
      }
    }

    document.getElementById('next').addEventListener('click', navigateToNextPokemon);
    document.getElementById('previous').addEventListener('click', navigateToPreviousPokemon);
  
}

function displayPokemon(pokemon) {
  currentPokemonId = pokemon.id; // Met à jour l'ID actuel
  const detailsContainer = document.getElementById('pokemon-details');

  const resistances = pokemon.apiResistances
    .filter(res => res.damage_relation === 'resistant' || res.damage_relation === 'twice_resistant')
    .map(res => `<li>${res.name} (${res.damage_multiplier}x)</li>`).join('');

  const vulnerabilities = pokemon.apiResistances
    .filter(res => res.damage_relation === 'vulnerable')
    .map(res => `<li>${res.name} (${res.damage_multiplier}x)</li>`).join('');

  const evolutions = pokemon.apiEvolutions.length > 0
    ? pokemon.apiEvolutions.map(evo => `<li>${evo.name} (#${evo.pokedexId})</li>`).join('')
    : '<li>Aucune évolution disponible.</li>';

  detailsContainer.innerHTML = `
    <div id="pokemon-id-name">
    <p class="pokemon-id">${pokemon.id}</p>
    <h2 class="pokemon-name">${pokemon.name}</h2></div>
    <div id="pkm-img"><img src="${pokemon.image}" alt="${pokemon.name}"></div>
    <p id="type-p"><strong>Types :</strong></p>
    <div id="type-container">
      ${pokemon.apiTypes.map(type => `
        <div class="type">
          <img src="${type.image}" alt="${type.name}" title="${type.name}">
          <span>${type.name}</span>
        </div>
      `).join('')}
    </div>
    
    <div id="pkm-stats">
    <div id="stats">
    <p><strong>Statistiques :</strong></p>
    <ul type="none">
      ${Object.entries(pokemon.stats).map(([stat, value]) => `<li>${stat}: ${value}</li>`).join('')}
    </ul>
    </div>

    <div id="strengths">
    <p><strong>Forces :</strong></p>
    <ul type="none">
      ${resistances || '<li>Aucune force détectée.</li>'}
    </ul>
    </div>

    <div id="weaknesses">
    <p><strong>Faiblesses :</strong></p>
    <ul type="none">
      ${vulnerabilities || '<li>Aucune faiblesse détectée.</li>'}
    </ul>
    </div>

    <div id="evolutions">
    <p><strong>Évolutions :</strong></p>
    <ul type="none">
      ${evolutions}
    </ul>
    </div>
    </div>
  `;
}
