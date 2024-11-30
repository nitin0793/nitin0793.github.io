const API_URL = "https://api.coingecko.com/api/v3/coins/markets";
const params = {
  vs_currency: "usd",
  order: "market_cap_desc",
  per_page: 20,
  page: 1,
  sparkline: false,
};

let selectedCryptos = JSON.parse(localStorage.getItem("selectedCryptos")) || [];

async function fetchCryptos(order) {
  const url = `${API_URL}?vs_currency=${params.vs_currency}&order=${order || params.order}&per_page=${params.per_page}&page=${params.page}&sparkline=${params.sparkline}`;
  const response = await fetch(url);
  const data = await response.json();
  renderCryptos(data);
}

function renderCryptos(cryptos) {
  const grid = document.querySelector("#crypto-list .grid");
  grid.innerHTML = ""; // Clear grid
  cryptos.forEach((crypto) => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <h3>${crypto.name} (${crypto.symbol.toUpperCase()})</h3>
      <p>Price: $${crypto.current_price}</p>
      <p id="price-change-${crypto.id}" class="price-change" style="display: none;">
        24h Change: ${crypto.price_change_percentage_24h.toFixed(2)}%
      </p>
      <button onclick="addToComparison('${crypto.id}', '${crypto.name}', ${crypto.current_price})">
        Compare
      </button>
    `;
    grid.appendChild(card);
  });
}

function addToComparison(id, name, price) {
  if (selectedCryptos.length >= 5) {
    alert("You can only compare up to 5 cryptocurrencies.");
    return;
  }

  selectedCryptos.push({ id, name, price });
  localStorage.setItem("selectedCryptos", JSON.stringify(selectedCryptos));
  renderComparison();
}

function removeFromComparison(index) {
  selectedCryptos.splice(index, 1); // Remove crypto by index
  localStorage.setItem("selectedCryptos", JSON.stringify(selectedCryptos));
  renderComparison();
}

function renderComparison() {
  const comparisonGrid = document.querySelector("#comparison .comparison-grid");
  if (selectedCryptos.length > 0) {
    comparisonGrid.innerHTML = selectedCryptos
      .map(
        (crypto, index) => `
        <div class="card">
          <h3>${crypto.name}</h3>
          <p>Price: $${crypto.price}</p>
          <button onclick="removeFromComparison(${index})">Remove</button>
        </div>`
      )
      .join("");
  } else {
    comparisonGrid.innerHTML = `<p>Select cryptocurrencies to compare.</p>`;
  }
}

// Event listener for sorting
document.getElementById("sort-by").addEventListener("change", (event) => {
  fetchCryptos(event.target.value);
});

// Event listener for toggling 24h price change
document.getElementById("show-price-change").addEventListener("change", (event) => {
  document.querySelectorAll(".price-change").forEach((el) => {
    el.style.display = event.target.checked ? "block" : "none";
  });
});

// Initial fetch and render
fetchCryptos();
renderComparison();
