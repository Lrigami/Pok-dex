let pokemons = [];

// Charger le fichier JSON
fetch('./data/pokebuildAPI.json')
  .then(response => {
    if (!response.ok) {
      throw new Error('Erreur lors du chargement des données');
    }
    return response.json();
  })
  .then(data => {
    pokemons = data;
    console.log('Données chargées:', pokemons);
  })
  .catch(error => {
    console.error('Erreur :', error);
  });

// Barre de recherche
document.getElementById('pokemon-search').addEventListener('input', (event) => {
  const query = event.target.value.trim().toLowerCase();

  // Recherche par ID ou nom
  const result = pokemons.find(pokemon =>
    pokemon.id === parseInt(query) || pokemon.name.toLowerCase() === query
  );

  const detailsContainer = document.getElementById('pokemon-details');
  detailsContainer.innerHTML = '';

  if (result) {
    // Génère les forces et faiblesses
    const resistances = result.apiResistances
      .filter(res => res.damage_relation === 'resistant' || res.damage_relation === 'twice_resistant')
      .map(res => `<li>${res.name} (${res.damage_multiplier}x)</li>`).join('');

    const vulnerabilities = result.apiResistances
      .filter(res => res.damage_relation === 'vulnerable')
      .map(res => `<li>${res.name} (${res.damage_multiplier}x)</li>`).join('');

    // Génère les évolutions
    const evolutions = result.apiEvolutions.length > 0
      ? result.apiEvolutions.map(evo => `<li>${evo.name} (#${evo.pokedexId})</li>`).join('')
      : '<li>Aucune évolution disponible.</li>';

    // Affiche les informations du Pokémon
    detailsContainer.innerHTML = `
      <img src="${result.image}" alt="${result.name}">
      <h2>${result.name} (#${result.pokedexId})</h2>
      
      <p><strong>Types :</strong></p>
      <div id="type-container">
        ${result.apiTypes.map(type => `
          <div class="type">
            <img src="${type.image}" alt="${type.name}" title="${type.name}">
            <span>${type.name}</span>
          </div>
        `).join('')}
      </div>
      
      <p><strong>Statistiques :</strong></p>
      <ul>
        ${Object.entries(result.stats).map(([stat, value]) => `<li>${stat}: ${value}</li>`).join('')}
      </ul>

      <p><strong>Forces :</strong></p>
      <ul>
        ${resistances || '<li>Aucune force détectée.</li>'}
      </ul>

      <p><strong>Faiblesses :</strong></p>
      <ul>
        ${vulnerabilities || '<li>Aucune faiblesse détectée.</li>'}
      </ul>

      <p><strong>Évolutions :</strong></p>
      <ul>
        ${evolutions}
      </ul>
    `;
  } else if (query) {
    detailsContainer.innerHTML = '<p>Aucun Pokémon trouvé.</p>';
  }
});
