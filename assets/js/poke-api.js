const pokeApi = {};

function convertPokeApiDetailToPokemon(pokeDetail) {
  const pokemon = new Pokemon();
  pokemon.number = pokeDetail.id;
  pokemon.name = pokeDetail.name;

  const types = pokeDetail.types.map((typeSlot) => typeSlot.type.name);
  const [type] = types;

  pokemon.types = types;
  pokemon.type = type;

  // Tenta usar a imagem dream_world, se não existir usa a oficial animada, se não existir usa a oficial estática
  pokemon.photo =
    pokeDetail.sprites.other.dream_world.front_default ||
    pokeDetail.sprites.other["official-artwork"].front_default ||
    pokeDetail.sprites.front_default;

  // Add additional details
  pokemon.height = pokeDetail.height / 10; // Convert to meters
  pokemon.weight = pokeDetail.weight / 10; // Convert to kg
  pokemon.abilities = pokeDetail.abilities.map(
    (ability) => ability.ability.name
  );

  // Add stats
  pokemon.stats = {
    hp: pokeDetail.stats.find((stat) => stat.stat.name === "hp").base_stat,
    attack: pokeDetail.stats.find((stat) => stat.stat.name === "attack")
      .base_stat,
    defense: pokeDetail.stats.find((stat) => stat.stat.name === "defense")
      .base_stat,
    specialAttack: pokeDetail.stats.find(
      (stat) => stat.stat.name === "special-attack"
    ).base_stat,
    specialDefense: pokeDetail.stats.find(
      (stat) => stat.stat.name === "special-defense"
    ).base_stat,
    speed: pokeDetail.stats.find((stat) => stat.stat.name === "speed")
      .base_stat,
  };

  return pokemon;
}

pokeApi.getPokemonSpecies = (id) => {
  return fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`).then(
    (response) => response.json()
  );
};

pokeApi.getPokemonDetail = (pokemon) => {
  return fetch(pokemon.url)
    .then((response) => response.json())
    .then(convertPokeApiDetailToPokemon);
};

pokeApi.getPokemons = (offset = 0, limit = 5) => {
  const url = `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`;

  return fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then((jsonBody) => jsonBody.results)
    .then((pokemons) => pokemons.map(pokeApi.getPokemonDetail))
    .then((detailRequests) => Promise.all(detailRequests))
    .catch((error) => {
      console.error("Error fetching pokemon data:", error);
      throw error;
    });
};
