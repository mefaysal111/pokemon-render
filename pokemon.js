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
    console.log(data);
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
