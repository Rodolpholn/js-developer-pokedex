const pokemonList = document.getElementById("pokemonList");
const loadMoreButton = document.getElementById("loadMoreButton");
const searchInput = document.getElementById("searchInput");
const categoryButtons = document.querySelectorAll(".category-btn");

const maxRecords = 151;
const limit = 20;
let offset = 0;
let currentCategory = "all";
let allPokemons = [];

// Adicionar variável global para favoritos
let favoritePokemon = JSON.parse(
  localStorage.getItem("favoritePokemon") || "[]"
);

function convertPokemonToLi(pokemon) {
  return `
    <li class="pokemon ${pokemon.type}">
        <span class="number">#${String(pokemon.number).padStart(3, "0")}</span>
        <span class="name">${pokemon.name}</span>

        <div class="detail">
            <ol class="types">
                ${pokemon.types
                  .map((type) => `<li class="type ${type}">${type}</li>`)
                  .join("")}
            </ol>

            <img src="${pokemon.photo}"
                 alt="${pokemon.name}">
        </div>
        <img src="./assets/icons/${
          pokemon.type
        }.svg" alt="" class="type-icon" aria-hidden="true">
    </li>
  `;
}

function filterByCategory(pokemons, category) {
  if (category === "all") return pokemons;
  if (category === "favorite")
    return pokemons.filter((pokemon) => isFavorite(pokemon.number));
  return pokemons.filter((pokemon) => pokemon.types.includes(category));
}

function updatePokemonList() {
  const filteredPokemons = filterByCategory(allPokemons, currentCategory);

  if (filteredPokemons.length === 0) {
    pokemonList.innerHTML =
      currentCategory === "favorite"
        ? '<li class="message">No favorite Pokémon yet.</li>'
        : '<li class="message">No Pokémon found in this category.</li>';
    return;
  }

  const newHtml = filteredPokemons.map(convertPokemonToLi).join("");
  pokemonList.innerHTML = newHtml;

  // Adiciona o evento de clique para cada pokemon
  const pokemonItems = document.querySelectorAll(".pokemon");
  pokemonItems.forEach((item) => {
    item.addEventListener("click", () => {
      const pokemonIndex = Array.from(pokemonItems).indexOf(item);
      const pokemon = filteredPokemons[pokemonIndex];
      openPokemonDetail(pokemon);
    });
  });
}

function loadPokemonItens(offset, limit) {
  const loadingMessage = document.createElement("li");
  loadingMessage.className = "message";
  loadingMessage.textContent = "Loading Pokémon...";

  if (offset === 0) {
    pokemonList.innerHTML = "";
    pokemonList.appendChild(loadingMessage);
  }

  pokeApi
    .getPokemons(offset, limit)
    .then((newPokemons = []) => {
      // Adiciona os novos pokémons ao array global
      allPokemons =
        offset === 0 ? newPokemons : [...allPokemons, ...newPokemons];

      // Atualiza a lista
      updatePokemonList();

      // Verifica se precisa esconder o botão Load More
      if (allPokemons.length >= maxRecords) {
        loadMoreButton.style.display = "none";
      }
    })
    .catch((error) => {
      console.error("Error loading pokemons:", error);
      pokemonList.innerHTML =
        '<li class="message">Error loading Pokémon. Try again.</li>';
    });
}

function handleCategoryChange(event) {
  const selectedCategory = event.currentTarget.classList[1];

  // Remove active class from all buttons
  categoryButtons.forEach((button) => button.classList.remove("active"));

  // Add active class to clicked button
  event.currentTarget.classList.add("active");

  // Atualiza categoria atual
  currentCategory = selectedCategory;

  // Atualiza a lista
  updatePokemonList();
}

function handleSearch(event) {
  const searchTerm = event.target.value.toLowerCase();
  const filteredPokemons = allPokemons.filter((pokemon) =>
    pokemon.name.toLowerCase().includes(searchTerm)
  );

  if (filteredPokemons.length === 0) {
    pokemonList.innerHTML =
      '<li class="message">Nenhum Pokémon encontrado.</li>';
    return;
  }

  const newHtml = filteredPokemons.map(convertPokemonToLi).join("");
  pokemonList.innerHTML = newHtml;
}

// Event Listeners
loadMoreButton.addEventListener("click", () => {
  offset += limit;
  const qtdRecordsWithNexPage = offset + limit;

  if (qtdRecordsWithNexPage >= maxRecords) {
    const newLimit = maxRecords - offset;
    loadPokemonItens(offset, newLimit);
  } else {
    loadPokemonItens(offset, limit);
  }
});

searchInput.addEventListener("input", handleSearch);

categoryButtons.forEach((button) => {
  button.addEventListener("click", handleCategoryChange);
});

// Load initial pokemon
loadPokemonItens(0, limit);

// Modal functions
function openPokemonDetail(pokemon) {
  const modal = document.getElementById("pokemonModal");
  const modalContent = modal.querySelector(".modal-content");

  modalContent.className = `modal-content ${pokemon.type}`;

  modalContent.innerHTML = `
    <div class="modal-header">
      <button class="modal-back" onclick="closeModal()">←</button>
      <button class="modal-favorite ${
        isFavorite(pokemon.number) ? "active" : ""
      }" onclick="toggleFavorite(${pokemon.number})">
        ${isFavorite(pokemon.number) ? "♥" : "♡"}
      </button>
    </div>
    <div class="pokemon-detail">
      <img src="./assets/icons/${
        pokemon.type
      }.svg" alt="" class="type-icon" aria-hidden="true">
      <span class="number">#${String(pokemon.number).padStart(3, "0")}</span>
      <h2 class="name">${pokemon.name}</h2>
      <div class="types">
        ${pokemon.types
          .map((type) => `<span class="type ${type}">${type}</span>`)
          .join("")}
      </div>
      <div class="image-container">
        <img src="${pokemon.photo}" alt="${
    pokemon.name
  }" class="pokemon-detail-image">
      </div>
    </div>
    <div class="detail-tabs">
      <div class="detail-tab active" data-tab="about">About</div>
      <div class="detail-tab" data-tab="base-stats">Base Stats</div>
      <div class="detail-tab" data-tab="evolution">Evolution</div>
      <div class="detail-tab" data-tab="moves">Moves</div>
    </div>
    <div class="tab-content">
      <!-- Tab content will be loaded here -->
    </div>
  `;

  // Atualiza as tabs e mostra o conteúdo inicial
  const tabs = modalContent.querySelectorAll(".detail-tab");
  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");
      showTabContent(tab.dataset.tab, pokemon);
    });
  });

  showTabContent("about", pokemon);
  modal.style.display = "flex";
}

function closeModal() {
  const modal = document.getElementById("pokemonModal");
  modal.style.display = "none";
}

// Adiciona evento para fechar o modal com a tecla ESC
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeModal();
  }
});

// Fecha o modal quando clicar fora dele
document.getElementById("pokemonModal").addEventListener("click", (event) => {
  if (event.target.classList.contains("modal-overlay")) {
    closeModal();
  }
});

// Previne que o clique dentro do modal feche ele
document.querySelector(".modal-content").addEventListener("click", (event) => {
  event.stopPropagation();
});

function showTabContent(tab, pokemon) {
  const tabContent = document.querySelector(".tab-content");

  switch (tab) {
    case "about":
      tabContent.innerHTML = `
        <div class="info-row">
          <span class="info-label">Species</span>
          <span class="info-value">Seed</span>
        </div>
        <div class="info-row">
          <span class="info-label">Height</span>
          <span class="info-value">2'3.6" (0.70 cm)</span>
        </div>
        <div class="info-row">
          <span class="info-label">Weight</span>
          <span class="info-value">15.2 lbs (6.9 kg)</span>
        </div>
        <div class="info-row">
          <span class="info-label">Abilities</span>
          <span class="info-value">Overgrow, Chlorophyll</span>
        </div>
        
        <div class="breeding-section">
          <h3>Breeding</h3>
          <div class="info-row">
            <span class="info-label">Gender</span>
            <div class="gender-value">
              <span class="male">♂ 87.5%</span>
              <span class="female">♀ 12.5%</span>
            </div>
          </div>
          <div class="info-row">
            <span class="info-label">Egg Groups</span>
            <span class="info-value">Monster</span>
          </div>
          <div class="info-row">
            <span class="info-label">Egg Cycle</span>
            <span class="info-value">Grass</span>
          </div>
        </div>
      `;
      break;
    case "base-stats":
      tabContent.innerHTML = `
        <div class="info-row">
          <span class="info-label">HP</span>
          <span class="info-value">${pokemon.stats.hp}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Attack</span>
          <span class="info-value">${pokemon.stats.attack}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Defense</span>
          <span class="info-value">${pokemon.stats.defense}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Sp. Atk</span>
          <span class="info-value">${pokemon.stats.specialAttack}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Sp. Def</span>
          <span class="info-value">${pokemon.stats.specialDefense}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Speed</span>
          <span class="info-value">${pokemon.stats.speed}</span>
        </div>
      `;
      break;
    case "evolution":
      tabContent.innerHTML = `
        <div class="message">Evolution chain coming soon!</div>
      `;
      break;
    case "moves":
      tabContent.innerHTML = `
        <div class="message">Moves list coming soon!</div>
      `;
      break;
  }
}

// Função para verificar se um pokemon é favorito
function isFavorite(pokemonNumber) {
  return favoritePokemon.includes(pokemonNumber);
}

// Função para alternar favorito
function toggleFavorite(pokemonNumber) {
  const index = favoritePokemon.indexOf(pokemonNumber);
  if (index === -1) {
    favoritePokemon.push(pokemonNumber);
  } else {
    favoritePokemon.splice(index, 1);
  }
  localStorage.setItem("favoritePokemon", JSON.stringify(favoritePokemon));

  // Atualiza o ícone do coração no modal
  const modalFavoriteBtn = document.querySelector(".modal-favorite");
  if (modalFavoriteBtn) {
    modalFavoriteBtn.classList.toggle("active");
    modalFavoriteBtn.innerHTML = isFavorite(pokemonNumber) ? "♥" : "♡";
  }

  // Só atualiza a lista se estiver na categoria favoritos
  if (currentCategory === "favorite") {
    updatePokemonList();
  }
}
