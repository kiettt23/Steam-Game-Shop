// API config
const options = {
  method: "GET",
  headers: {
    "x-rapidapi-key": "73f429fa2bmshb88d7ee7c7a0a90p1b831cjsn073066cd166d",
    "x-rapidapi-host": "games-details.p.rapidapi.com",
  },
};

// Lấy appID từ URL
const params = new URLSearchParams(window.location.search);
const appId = params.get("appId");

// Nếu không có appId → quay lại trang chính
if (!appId) {
  alert("Không tìm thấy ID game. Quay lại trang chính.");
  window.location.href = "main.html";
}

// Gọi API và hiển thị chi tiết game
async function loadGameDetail() {
  try {
    const res = await fetch(
      `https://games-details.p.rapidapi.com/gameinfo/single_game/${appId}`,
      options
    );
    const data = await res.json();
    const game = data?.data;

    if (!game) throw new Error("Không tìm thấy dữ liệu game.");
    console.log("Kết quả từ API:", data);

    renderGameDetail(game);
  } catch (err) {
    console.error("Lỗi khi tải dữ liệu chi tiết:", err);
    document.querySelector("#gameDetail").innerHTML =
      "<p>Lỗi tải dữ liệu game. Vui lòng thử lại sau.</p>";
  }
}

// Render nội dung chi tiết game ra giao diện
function renderGameDetail(game) {
  console.log("Chi tiết game:", game); // debug log

  // Tên game
  document.querySelector(".game-title").textContent =
    game.name || "Không có tên";
  // Hình ảnh
  document.querySelector(".game-image").src =
    game.media?.screenshot?.[0] || "assets/images/blank.gif";
  // Giá game
  document.querySelector(".game-price").textContent =
    (game.pricing?.[0]?.discountPrice || "Giá không xác định") +
    (game.pricing?.[0]?.discount ? ` (${game.pricing[0].discount})` : "");
  // Nhà phát hành
  document.querySelector(".game-publisher").textContent =
    game.dev_details?.publisher?.[0] || "Không rõ nhà phát hành";
  // Mô tả game
  document.querySelector(".game-description").textContent =
    game.about_game || game.desc || "Không có mô tả.";
}

loadGameDetail();
