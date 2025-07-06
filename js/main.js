// API config
const apiOptions = {
  method: "GET",
  headers: {
    "x-rapidapi-key": "73f429fa2bmshb88d7ee7c7a0a90p1b831cjsn073066cd166d",
    "x-rapidapi-host": "games-details.p.rapidapi.com",
  },
};

// Sections
const sections = [
  { id: "newReleases", label: "new", title: "🆕 Game Mới" },
  { id: "topSellers", label: "top", title: "🔥 Game Bán Chạy" },
  { id: "freeGames", label: "free", title: "💰 Game Miễn Phí" },
  { id: "actionGames", label: "action", title: "🎮 Hành Động" },
];

// Render Game Card
function createGameCard(game) {
  const headerImage = `https://cdn.cloudflare.steamstatic.com/steam/apps/${game.id}/header.jpg`;
  const fallbackImage = game.image || "assets/images/blank.gif";

  return `
    <div class="game-card" onclick="goToDetail('${game?.id}')">
      <img src="${headerImage}" 
           onerror="this.onerror=null; this.src='${fallbackImage}'" 
           alt="${game?.name || "No Title"}" />
      <h3>${game?.name || "Untitled"}</h3>
      <p>${game?.price || "Unknown"}</p>
    </div>
  `;
}

// Gọi API tìm kiếm game
async function fetchGames(query) {
  const url = `https://games-details.p.rapidapi.com/search?sugg=${query}`;
  const res = await fetch(url, apiOptions);
  const data = await res.json();
  return data?.data?.search || [];
}

// Load từng Section từ API
async function loadSectionGames(sectionId, query) {
  const container = document.getElementById(sectionId);
  container.innerHTML = "<p class='loading'>Đang tải...</p>";
  try {
    const games = await fetchGames(query);
    container.innerHTML = games.slice(0, 8).map(createGameCard).join("");
  } catch (err) {
    container.innerHTML = "<p class='error'>Lỗi khi tải game</p>";
  }
}

// Chuyển sang trang chi tiết
function goToDetail(appId) {
  window.location.href = `detail.html?appId=${appId}`;
}

// Lọc game theo tag (thể loại)
function filterByGenre(genreTag) {
  const results = document.getElementById("searchResults");

  hideAllSections();
  results.style.display = "flex";
  results.classList.add("gallery");
  results.innerHTML = "<p class='loading'>Đang lọc...</p>";

  fetchGames(genreTag).then((games) => {
    results.innerHTML = games.map(createGameCard).join("");
  });
}

// Tìm kiếm theo tên
function setupSearch() {
  const input = document.getElementById("searchInput");
  const results = document.getElementById("searchResults");

  input.addEventListener("input", async (e) => {
    const keyword = e.target.value.trim();

    // Nếu rỗng, reset lại
    if (!keyword) {
      resetToDefault();
      return;
    }

    hideAllSections();
    results.style.display = "flex";
    results.classList.add("gallery");
    results.innerHTML = "<p class='loading'>Đang tìm kiếm...</p>";

    try {
      const games = await fetchGames(keyword);
      results.innerHTML = games.map(createGameCard).join("");
    } catch {
      results.innerHTML = "<p class='error'>Lỗi tìm kiếm</p>";
    }
  });
}

// Ẩn tất cả section mặc định
function hideAllSections() {
  document.querySelectorAll(".game-section").forEach((section) => {
    section.style.display = "none";
  });
}

// Reset về trạng thái ban đầu (khi bấm “All”)
function resetToDefault() {
  const results = document.getElementById("searchResults");
  results.innerHTML = "";
  results.style.display = "none";

  document.querySelectorAll(".game-section").forEach((section) => {
    section.style.display = "block";
  });

  sections.forEach((section) => loadSectionGames(section.id, section.label));
}

// Khởi chạy trang khi load
sections.forEach((section) => loadSectionGames(section.id, section.label));
setupSearch();
