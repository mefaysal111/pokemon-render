const searchBtn = document.getElementById('searchBtn');
const inputPokemon = document.getElementById('pokemonInput');
const errorMsg = document.getElementById('errorMsg');
const card = document.querySelector('.all-container');
const pokemonName = document.getElementById('pokemonName');
const pokemonImage = document.getElementById('pokemonImg');
const pokemonType = document.getElementById('pokemonTypes');
const pokemonAbility = document.getElementById('pokemonAbilities');
const pokemonHeight = document.getElementById('pokemonHeight');
const pokemonWeight = document.getElementById('pokemonWeight');
const pokemonId = document.getElementById('pokemonId');
const container = document.getElementById('stats-container');
const randomBtn = document.getElementById('randomBtn');
const favoriteBtn = document.getElementById('favoriteBtn');
const favoritesList = document.getElementById('favoritesList');
const typeColors = {
  fire: '#FDDFDF',
  grass: '#DEFDE0',
  electric: '#FCF7DE',
  water: '#DEF3FD',
  ground: '#f4e7da',
  rock: '#d5d5d4',
  fairy: '#fceaff',
  poison: '#98d7a5',
  bug: '#f8d5a3',
  dragon: '#97b3e6',
  psychic: '#eaeda1',
  flying: '#F5F5F5',
  fighting: '#E6E0D4',
  normal: '#F5F5F5',
  ice: '#e0f5ff',
  ghost: '#dbb8ff',
  dark: '#c8c6c6',
  steel: '#e3e3e3',
};

let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

// Function to render favorites
function renderFavorites() {
  favoritesList.innerHTML = '';
  favorites.forEach((name) => {
    const li = document.createElement('li');
    li.textContent = name;

    // Click event to show Pokémon details
    li.addEventListener('click', () => {
      inputPokemon.value = name; // set input to favorite name
      fetchPokemon(); // fetch and display details
    });

    favoritesList.appendChild(li);
  });
}

// Call once on page load
renderFavorites();

// Add favorite button
favoriteBtn.addEventListener('click', () => {
  const name = pokemonName.textContent;
  if (!name) return alert('No Pokémon loaded');

  if (favorites.includes(name)) return; // do nothing if already added

  favorites.push(name);
  localStorage.setItem('favorites', JSON.stringify(favorites));
  renderFavorites();
});

randomBtn.addEventListener('click', () => {
  const randomId = Math.floor(Math.random() * 1010) + 1;
  inputPokemon.value = randomId;
  fetchPokemon();
});
async function fetchPokemon() {
  const pokemon = inputPokemon.value;
  try {
    errorMsg.textContent = '';
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon}`);
    if (!res.ok) {
      //ok and status is predefined
      throw Error(`Request failed with status ${res.status}`);
    }
    const data = await res.json();
    const mainType = data.types[0].type.name;
    const borderColor = typeColors[mainType] || '#ccc';

    document.querySelector('.pokemon-card').style.borderColor = borderColor;

    card.classList.remove('active');
    pokemonId.textContent = data.id;
    pokemonName.textContent = data.name;
    pokemonImage.src = data.sprites.other['official-artwork'].front_default;
    pokemonType.textContent = data.types[0].type.name;
    pokemonHeight.textContent = data.height;
    pokemonWeight.textContent = data.weight;
    const abilityNames = data.abilities.map((a) => a.ability.name);
    pokemonAbility.textContent = abilityNames;
    const stats = data.stats.map((s) => ({
      // to get base stat and name used map because in array
      name: s.stat.name,
      value: s.base_stat,
    }));
    console.log(stats);
    container.innerHTML = '';
    const maxStat = 200;
    stats.forEach((stat) => {
      const percent = Math.round((stat.value / maxStat) * 100);

      const statHTML = `
      <div class="align-row">

        <span class="label">${stat.name}</span>
        <div class="bar-container">
          <div class="bar" style="width: ${percent}%"></div>
        </div>
        <span class="value">${stat.value}</span>
        </div>
    
    `;

      container.innerHTML += statHTML;
    });
  } catch (e) {
    console.error(e);
    card.classList.add('active');
    errorMsg.textContent = e;
  } finally {
    console.log('Run this block');
  }
}
searchBtn.addEventListener('click', () => {
  if (inputPokemon.value) {
    fetchPokemon();
  } else {
    alert('please enter pokemon name');
  }
});
window.addEventListener('load', () => {
  const randomId = Math.floor(Math.random() * 1010) + 1;
  inputPokemon.value = randomId;
  fetchPokemon();
});
