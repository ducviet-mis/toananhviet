(async function initUniversalHeader() {
  const SUPABASE_URL = 'https://zlltfgfbydgojuuiprsb.supabase.co';
  const SUPABASE_KEY = 'sb_publishable_Od5eLUer9_l6i6IzNVBjvg_VAZy-9t2';
  
  let _supabase = null;
  if (window.supabase) {
    _supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
  }

  // 1. Xác định trang hiện tại để Highlight Menu Active
  const currentPath = window.location.pathname;
  const isHome = currentPath.endsWith('index.html') || currentPath === '/';
  const isQuiz = currentPath.includes('quiz-list.html') || currentPath.includes('quiz-room.html');

  // 2. Chèn cấu trúc Header chuẩn 100% vào thẻ <header class="site-header">
  const siteHeader = document.querySelector('.site-header');
  if (siteHeader) {
    siteHeader.innerHTML = `
      <nav class="nav-container">
        <a href="index.html" class="logo" style="text-decoration:none; font-weight:800; color:#0284c7; font-size:18px; display:flex; align-items:center; gap:8px;">
          <img src="assets/logo.png" alt="Logo" class="logo-img" style="height:35px;" onerror="this.src='https://via.placeholder.com/40?text=TAV'">
          TOÁN ANH VIỆT
        </a>
        <ul class="nav-menu" id="main-nav-menu">
          <li><a href="index.html" class="${isHome ? 'active' : ''}">Trang chủ</a></li>
          
          <li class="nav-dropdown">
            <a href="#" class="dropbtn">Tài liệu Toán</a>
            <div class="dropdown-content">
              <a href="category.html?grade=6">Toán 6</a>
              <a href="category.html?grade=7">Toán 7</a>
              <a href="category.html?grade=8">Toán 8</a>
              <a href="category.html?grade=9">Toán 9</a>
            </div>
          </li>

          <li><a href="quiz-list.html" class="${isQuiz ? 'active' : ''}">Thi Online</a></li>
          <li><a href="index.html#register" class="highlight">Lớp học Gia sư</a></li>
          <li id="auth-menu-item"><a href="login.html">Đăng nhập</a></li>
        </ul>
      </nav>
    `;
  }

  // 3. Tự động inject CSS đồng bộ cho Dropdown Avatar
  if (!document.getElementById('universal-header-style')) {
    const style = document.createElement('style');
    style.id = 'universal-header-style';
    style.innerHTML = `
      .user-profile-dropdown { position: relative; display: inline-block; cursor: pointer; margin-left: 8px; padding-bottom: 12px; }
      .menu-avatar-img { width: 36px; height: 36px; border-radius: 50%; border: 2px solid #0284c7; object-fit: cover; vertical-align: middle; transition: all 0.2s ease; }
      .user-profile-dropdown:hover .menu-avatar-img { transform: scale(1.05); box-shadow: 0 0 0 3px rgba(2, 132, 199, 0.15); }
      .dropdown-menu-box { display: none; position: absolute; right: 0; top: 100%; background-color: white; min-width: 210px; box-shadow: 0 10px 30px rgba(0,0,0,0.1); border-radius: 10px; padding: 8px 0; z-index: 9999; margin-top: 2px; border: 1px solid #e2e8f0; transform-origin: top right; animation: fadeInDropdown 0.2s cubic-bezier(0.4, 0, 0.2, 1); }
      .dropdown-menu-box::before { content: ""; position: absolute; top: -15px; left: 0; width: 100%; height: 15px; background: transparent; }
      @keyframes fadeInDropdown { from { opacity: 0; transform: scale(0.95) translateY(-5px); } to { opacity: 1; transform: scale(1) translateY(0); } }
      .user-profile-dropdown:hover .dropdown-menu-box { display: block; }
      .dropdown-info-header { padding: 10px 16px; border-bottom: 1px solid #f1f5f9; margin-bottom: 4px; }
      .dropdown-info-name { font-weight: 600; color: #1e293b; font-size: 14px; text-align: left; }
      .dropdown-info-email { color: #64748b; font-size: 12px; text-align: left; }
      .dropdown-item-link { display: block; padding: 10px 16px; color: #334155 !important; font-size: 14px; text-decoration: none; transition: background 0.15s; text-align: left; font-weight: 500 !important; }
      .dropdown-item-link:hover { background-color: #f1f5f9; color: #0284c7 !important; }
      .dropdown-item-logout { border-top: 1px solid #f1f5f9; margin-top: 4px; color: #ef4444 !important; }
      .dropdown-item-logout:hover { background-color: #fef2f2; }
    `;
    document.head.appendChild(style);
  }

  // 4. Đọc Cache render ngay lập tức (Xử lý giật lag UX)
  const cachedUser = localStorage.getItem('tav_user_session');
  if (cachedUser) {
    try {
      const u = JSON.parse(cachedUser);
      renderAvatarUI(u.name, u.email, u.avatar);
    } catch(e) {}
  }

  // 5. Đồng bộ thông tin từ Supabase
  if (_supabase) {
    const { data: { user } } = await _supabase.auth.getUser();
    if (user) {
      const meta = user.user_metadata || {};
      const dName = meta.full_name || 'Học viên';
      const aSrc = meta.avatar_url || `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(user.email)}`;
      
      localStorage.setItem('tav_user_session', JSON.stringify({ name: dName, email: user.email, avatar: aSrc }));
      renderAvatarUI(dName, user.email, aSrc);
    } else {
      localStorage.removeItem('tav_user_session');
    }
  }

  // Hàm vẽ UI Dropdown chuẩn Trang chủ (có 4 mục)
  function renderAvatarUI(name, email, avatar) {
    const authLI = document.getElementById('auth-menu-item');
    if (!authLI) return;

    authLI.innerHTML = `
      <div class="user-profile-dropdown">
        <img class="menu-avatar-img" src="${avatar}" alt="Avatar">
        <div class="dropdown-menu-box">
          <div class="dropdown-info-header">
            <div class="dropdown-info-name">${name}</div>
            <div class="dropdown-info-email">${email}</div>
          </div>
          <a href="profile.html" class="dropdown-item-link">Thông tin cá nhân</a>
          <a href="my-books.html" class="dropdown-item-link">Sách của tôi</a>
          <a href="my-books.html#activate" class="dropdown-item-link">Kích hoạt sách</a>
          <a href="#" id="menu-btn-logout-action" class="dropdown-item-link dropdown-item-logout">Đăng xuất</a>
        </div>
      </div>
    `;

    document.getElementById('menu-btn-logout-action')?.addEventListener('click', async (e) => {
      e.preventDefault();
      localStorage.removeItem('tav_user_session');
      if (_supabase) await _supabase.auth.signOut();
      window.location.reload();
    });
  }
})();
