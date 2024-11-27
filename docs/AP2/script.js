// **1** Function to fetch Pokémon data from the API
async function fetchPokemonData(pokemonId) {
    try {
        console.log(`Fetching data for Pokémon ID: ${pokemonId}`); // Debugging log
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`);
        if (!response.ok) throw new Error(`Pokémon ID ${pokemonId} not found.`);
        const data = await response.json();
        console.log(`Fetched data for Pokémon ID: ${pokemonId}`, data); // Debugging log
        return data;
    } catch (error) {
        console.error(`Error fetching Pokémon ID ${pokemonId}:`, error);
        return null;
    }
}

// **2** Variables for pagination
let currentPage = 1; // Tracks the current page
const itemsPerPage = 10; // Number of Pokémon per page
let currentType = ''; // Tracks the selected Pokémon type

// **3** Function to render the default gallery with flip cards
async function renderGallery() {
    console.log('Starting to render gallery...'); // Debugging log
    const gallery = document.getElementById('pokemon-gallery');
    gallery.innerHTML = ''; // Clear existing gallery content

    for (let i = 1; i <= 10; i++) {
        const pokemon = await fetchPokemonData(i); // Fetch data for each Pokémon ID
        if (pokemon) {
            const card = document.createElement('div');
            card.className = 'card';

            card.innerHTML = `
                <div class="card-inner">
                    <div class="card-front">
                        <p>${pokemon.name}</p>
                        <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
                        <p>Type: ${pokemon.types.map(t => t.type.name).join(', ')}</p>
                    </div>
                    <div class="card-back" style="background: url('./imagens/card_backside.png') no-repeat center/cover;"></div>
                </div>
            `;

            card.addEventListener('click', () => showModal(pokemon));
            gallery.appendChild(card);
        }
    }

    // Apply the layout rules
    gallery.style.display = 'grid';
    gallery.style.gap = '20px';
    gallery.style.gridTemplateColumns = window.innerWidth >= 768 ? 'repeat(5, 1fr)' : 'repeat(2, 1fr)';

    console.log('Finished rendering gallery.'); // Debugging log
}


// **4** Function to display modal with Pokémon details
function showModal(pokemon) {
    console.log(`Opening modal for Pokémon: ${pokemon.name}`);
    const modal = document.getElementById('pokemon-modal');
    const modalData = document.getElementById('modal-data');

    modalData.innerHTML = `
        <h2>${pokemon.name}</h2>
        <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
        <p><strong>Type:</strong> ${pokemon.types.map(t => t.type.name).join(', ')}</p>
        <p><strong>Height:</strong> ${pokemon.height} decimeters</p>
        <p><strong>Weight:</strong> ${pokemon.weight} hectograms</p>
        <p><strong>Abilities:</strong> ${pokemon.abilities.map(a => a.ability.name).join(', ')}</p>
        <p><strong>Stats:</strong></p>
        <ul>
            ${pokemon.stats.map(stat => `<li>${stat.stat.name}: ${stat.base_stat}</li>`).join('')}
        </ul>
    `;

    modal.classList.add('show');
}

// **5** Function to hide the modal
function hideModal() {
    console.log('Closing modal.');
    const modal = document.getElementById('pokemon-modal');
    modal.classList.remove('show');
}

document.getElementById('close-modal').addEventListener('click', hideModal);

// **6** Close modal when clicking outside content
document.getElementById('pokemon-modal').addEventListener('click', (event) => {
    if (event.target === document.getElementById('pokemon-modal')) {
        hideModal();
    }
});

// **7** Fetch Pokémon by type with pagination
async function fetchPokemonByType(type, page) {
    try {
        const offset = (page - 1) * itemsPerPage;
        console.log(`Fetching Pokémon of type: ${type}, Page: ${page}`);
        const response = await fetch(`https://pokeapi.co/api/v2/type/${type}`);
        if (!response.ok) throw new Error(`Type ${type} not found.`);
        const data = await response.json();

        const pokemonSlice = data.pokemon.slice(offset, offset + itemsPerPage);
        const filteredPokemon = await Promise.all(
            pokemonSlice.map(async (p) => await fetchPokemonData(p.pokemon.name))
        );

        return filteredPokemon.filter(pokemon => pokemon !== null);
    } catch (error) {
        console.error(`Error fetching Pokémon by type ${type}:`, error);
        return null;
    }
}

// **8** Update gallery based on type and pagination
async function updateTypeGallery() {
    const pokemonList = await fetchPokemonByType(currentType, currentPage);

    if (pokemonList && pokemonList.length > 0) {
        updateGallery(pokemonList);
        updatePaginationControls(pokemonList.length);
    } else {
        alert('No more Pokémon to display for this type.');
    }
}

// **11** Function to update the Pokémon gallery
function updateGallery(pokemonList) {
    const gallery = document.getElementById('pokemon-gallery'); // **11.1** Select the gallery
    gallery.innerHTML = ''; // **11.2** Clear existing gallery content

    // **11.3** Render each Pokémon as a card
    pokemonList.forEach((pokemon) => {
        const card = document.createElement('div'); // Create the card container
        card.className = 'card'; // Add the card class

        card.innerHTML = `
            <div class="card-inner">
                <div class="card-front">
                    <p>${pokemon.name}</p>
                    <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
                    <p>Type: ${pokemon.types.map(t => t.type.name).join(', ')}</p>
                </div>
                <div class="card-back" style="background: url('./imagens/card_backside.png') no-repeat center/cover;"></div>
            </div>
        `;

        // **11.4** Add event listener to open modal on click
        card.addEventListener('click', () => showModal(pokemon));
        gallery.appendChild(card); // **11.5** Add the card to the gallery
    });

    // **11.6** Ensure the gallery follows the 2x5 and 5x2 layout
    gallery.style.display = 'grid';
    gallery.style.gap = '20px';
    gallery.style.gridTemplateColumns = window.innerWidth >= 768 ? 'repeat(5, 1fr)' : 'repeat(2, 1fr)';
}


// **10** Pagination controls
function updatePaginationControls(itemCount) {
    const prevButton = document.getElementById('prev-page');
    const nextButton = document.getElementById('next-page');
    const pageNumber = document.getElementById('page-number');

    prevButton.disabled = currentPage === 1;
    nextButton.disabled = itemCount < itemsPerPage;

    pageNumber.textContent = `Page: ${currentPage}`;
}

document.getElementById('prev-page').addEventListener('click', async () => {
    if (currentPage > 1) {
        currentPage--;
        await updateTypeGallery();
    }
});

document.getElementById('next-page').addEventListener('click', async () => {
    currentPage++;
    await updateTypeGallery();
});

// **11** Type filtering with pagination
document.getElementById('type-form').addEventListener('submit', async (event) => {
    event.preventDefault();
    currentPage = 1;
    currentType = document.getElementById('pokemon-type').value;

    if (!currentType) {
        alert('Please select a Pokémon type.');
        return;
    }

    await updateTypeGallery();
});

// **12** Initialize gallery
document.addEventListener('DOMContentLoaded', renderGallery);
// **13** Event listener for search functionality
document.getElementById('pokemon-form').addEventListener('submit', async (event) => {
    event.preventDefault(); // Prevent page refresh
    const query = document.getElementById('pokemon-name').value.toLowerCase().trim(); // Get search input

    if (!query) {
        alert('Please enter a Pokémon name or ID.'); // Alert if input is empty
        return;
    }

    console.log(`Searching for Pokémon: ${query}`); // Debugging log

    const pokemon = await fetchPokemonData(query); // Fetch Pokémon data
    if (pokemon) {
        showModal(pokemon); // Directly display Pokémon details in the modal
    } else {
        // **13.1** Show error message in modal if Pokémon not found
        const modal = document.getElementById('pokemon-modal');
        const modalData = document.getElementById('modal-data');
        modalData.innerHTML = `
            <h2>Pokémon Not Found</h2>
            <p>No Pokémon matching "${query}" was found. Please try again!</p>
        `;
        modal.classList.add('show'); // Display the modal with an error message
    }
});
// **15** Function to fetch Pokémon by region
async function fetchPokemonByRegion(regionId) {
    try {
        console.log(`Fetching Pokémon for region ID: ${regionId}`); // Debugging log
        const response = await fetch(`https://pokeapi.co/api/v2/region/${regionId}`);
        if (!response.ok) throw new Error(`Region ID ${regionId} not found.`);
        const regionData = await response.json();
        console.log(`Fetched region data for ID ${regionId}:`, regionData); // Debugging log

        // **15.1** Extract Pokédex entries for the region
        const pokedexUrl = regionData.pokedexes[0].url; // Use the first Pokédex for the region
        const pokedexResponse = await fetch(pokedexUrl);
        if (!pokedexResponse.ok) throw new Error(`Could not fetch Pokédex for region ${regionId}`);
        const pokedexData = await pokedexResponse.json();
        console.log(`Fetched Pokédex data for region ${regionId}:`, pokedexData); // Debugging log

        // **15.2** Get Pokémon entries
        const pokemonEntries = pokedexData.pokemon_entries;
        const pokemonList = await Promise.all(
            pokemonEntries.map(async (entry) => await fetchPokemonData(entry.pokemon_species.name))
        );

        return pokemonList.filter(pokemon => pokemon !== null); // Filter out null or failed fetches
    } catch (error) {
        console.error(`Error fetching Pokémon for region ID ${regionId}:`, error);
        return null; // Return null to indicate failure
    }
}
// **16** Event listener for region-based filtering
document.getElementById('region-form').addEventListener('submit', async (event) => {
    event.preventDefault(); // Prevent form refresh
    const regionId = document.getElementById('pokemon-region').value; // Get selected region ID

    if (!regionId) {
        alert('Please select a Pokémon region.'); // Alert if no region is selected
        return;
    }

    console.log(`Selected region ID: ${regionId}`); // Debugging log

    try {
        const pokemonList = await fetchPokemonByRegion(regionId); // Fetch Pokémon for the selected region

        if (pokemonList && pokemonList.length > 0) {
            updateGallery(pokemonList); // Render Pokémon in the gallery
        } else {
            alert(`No Pokémon found for region ID ${regionId}. Please try another region.`);
        }
    } catch (error) {
        console.error('Error during region filtering:', error);
        alert('An error occurred while fetching Pokémon. Please try again.');
    }
});
