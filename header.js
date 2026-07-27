(async function initUniversalHeader() {
  const SUPABASE_URL = 'https://zlltfgfbydgojuuiprsb.supabase.co';
  const SUPABASE_KEY = 'sb_publishable_Od5eLUer9_l6i6IzNVBjvg_VAZy-9t2';
  
  let _supabase = null;
  if (window.supabase) {
    _supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
  }

  const currentPath = window.location.pathname;
  const isHome = currentPath.endsWith('index.html') || currentPath === '/' || currentPath.endsWith('/');
  const isQuiz = currentPath.includes('quiz-list.html') || currentPath.includes('quiz-room.html');
  const isDoc = currentPath.includes('category.html') || currentPath.includes('detail.html');
  const isClass = currentPath.includes('my-class.html');
  const isAdminClass = currentPath.includes('admin-class.html');

  // 1. Cấu trúc HTML Header gọn gàng chuẩn
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
            <a href="#" class="dropbtn ${isDoc ? 'active' : ''}">Tài liệu Toán ▾</a>
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

  // 2. CSS Ép Dropdown xổ xuống đúng chuẩn
  if (!document.getElementById('universal-header-style')) {
    const style = document.createElement('style');
    style.id = 'universal-header-style';
    style.innerHTML = `
      .site-header { background: rgba(255, 255, 255, 0.95) !important; backdrop-filter: blur(12px) !important; -webkit-backdrop-filter: blur(12px) !important; border-bottom: 1px solid rgba(226, 232, 240, 0.8) !important; position: sticky !important; top: 0 !important; z-index: 9999 !important; width: 100% !important; transition: all 0.3s ease !important; }
      .nav-container { display: flex !important; justify-content: space-between !important; align-items: center !important; width: 100% !important; max-width: 1200px !important; margin: 0 auto !important; padding: 12px 20px !important; }
      .nav-menu { display: flex !important; align-items: center !important; gap: 8px !important; list-style: none !important; margin: 0 !important; padding: 0 !important; flex-direction: row !important; }
      .nav-menu li { position: relative !important; display: inline-block !important; }
      .nav-menu li a { font-size: 14px !important; font-weight: 500 !important; color: #475569 !important; text-decoration: none !important; padding: 8px 16px !important; border-radius: 8px !important; background: transparent !important; display: inline-block !important; transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1) !important; }
      .nav-menu li a:hover { background: #f1f5f9 !important; color: #0284c7 !important; }
      .nav-menu li a.active { background: #e0f2fe !important; color: #0369a1 !important; font-weight: 600 !important; }
      
      .nav-dropdown { position: relative !important; display: inline-block !important; }
      .dropdown-content { display: none !important; position: absolute !important; top: 100% !important; left: 0 !important; background-color: #ffffff !important; min-width: 150px !important; box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1) !important; border-radius: 10px !important; padding: 6px 0 !important; z-index: 10000 !important; border: 1px solid #e2e8f0 !important; margin-top: 4px !important; }
      .dropdown-content a { color: #334155 !important; padding: 10px 16px !important; text-decoration: none !important; display: block !important; font-size: 14px !important; font-weight: 500 !important; border-radius: 0 !important; transition: all 0.2s ease !important; width: 100% !important; box-sizing: border-box !important; text-align: left !important; }
      .dropdown-content a:hover { background-color: #f1f5f9 !important; color: #0284c7 !important; }
      .nav-dropdown:hover .dropdown-content { display: block !important; }

      .user-profile-dropdown { position: relative !important; display: inline-block !important; cursor: pointer !important; margin-left: 8px !important; padding-bottom: 12px !important; }
      .menu-avatar-img { width: 36px !important; height: 36px !important; border-radius: 50% !important; border: 2px solid #0284c7 !important; object-fit: cover !important; vertical-align: middle !important; transition: all 0.2s ease !important; }
      .user-profile-dropdown:hover .menu-avatar-img { transform: scale(1.05) !important; box-shadow: 0 0 0 3px rgba(2, 132, 199, 0.15) !important; }
      .dropdown-menu-box { display: none !important; position: absolute !important; right: 0 !important; top: 100% !important; background-color: white !important; min-width: 220px !important; box-shadow: 0 10px 30px rgba(0,0,0,0.1) !important; border-radius: 12px !important; padding: 8px 0 !important; z-index: 10000 !important; margin-top: 2px !important; border: 1px solid #e2e8f0 !important; transform-origin: top right !important; animation: fadeInDropdown 0.2s cubic-bezier(0.4, 0, 0.2, 1) !important; }
      .dropdown-menu-box::before { content: "" !important; position: absolute !important; top: -15px !important; left: 0 !important; width: 100% !important; height: 15px !important; background: transparent !important; }
      @keyframes fadeInDropdown { from { opacity: 0; transform: scale(0.95) translateY(-5px); } to { opacity: 1; transform: scale(1) translateY(0); } }
      .user-profile-dropdown:hover .dropdown-menu-box { display: block !important; }
      .dropdown-info-header { padding: 10px 16px !important; border-bottom: 1px solid #f1f5f9 !important; margin-bottom: 4px !important; }
      .dropdown-info-name { font-weight: 700 !important; color: #1e293b !important; font-size: 14px !important; text-align: left !important; display: flex !important; align-items: center !important; gap: 6px !important; }
      .dropdown-info-email { color: #64748b !important; font-size: 12px !important; text-align: left !important; margin-top: 2px !important; }
      .dropdown-item-link { display: block !important; padding: 10px 16px !important; color: #334155 !important; font-size: 14px !important; text-decoration: none !important; transition: background 0.15s !important; text-align: left !important; font-weight: 500 !important; }
      .dropdown-item-link:hover { background-color: #f1f5f9 !important; color: #0284c7 !important; }
      .dropdown-item-link.active-item { color: #0284c7 !important; font-weight: 600 !important; background-color: #f0f9ff !important; }
      .dropdown-item-logout { border-top: 1px solid #f1f5f9 !important; margin-top: 4px !important; color: #ef4444 !important; }
      .dropdown-item-logout:hover { background-color: #fef2f2 !important; }
      
      .badge-teacher-tag { background: linear-gradient(135deg, #f97316 0%, #ea580c 100%) !important; color: #ffffff !important; font-size: 10px !important; font-weight: 800 !important; padding: 2px 6px !important; border-radius: 10px !important; letter-spacing: 0.3px !important; }
      .admin-menu-item { background-color: #f0f9ff !important; color: #0284c7 !important; font-weight: 700 !important; }
      .admin-menu-item:hover { background-color: #e0f2fe !important; }
    `;
    document.head.appendChild(style);
  }

  // 3. Cache UI Render
  const cachedUser = localStorage.getItem('tav_user_session');
  if (cachedUser) {
    try {
      const u = JSON.parse(cachedUser);
      renderAvatarUI(u.name, u.email, u.avatar, u.role === 'teacher');
    } catch(e) {}
  }

  // 4. Supabase Sync & Lấy Role từ bảng profiles
  if (_supabase) {
    const { data: { user } } = await _supabase.auth.getUser();
    if (user) {
      // Truy vấn lấy role từ bảng profiles
      const { data: profile } = await _supabase
        .from('profiles')
        .select('role, full_name')
        .eq('id', user.id)
        .single();

      const meta = user.user_metadata || {};
      const dName = profile?.full_name || meta.full_name || 'Học viên';
      const userRole = profile?.role || meta.role || 'student';
      const isTeacher = (userRole === 'teacher');
      const aSrc = meta.avatar_url || `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(user.email)}`;
      
      localStorage.setItem('tav_user_session', JSON.stringify({ name: dName, email: user.email, avatar: aSrc, role: userRole }));
      renderAvatarUI(dName, user.email, aSrc, isTeacher);
    } else {
      localStorage.removeItem('tav_user_session');
    }
  }

  function renderAvatarUI(name, email, avatar, isTeacher) {
    const authLI = document.getElementById('auth-menu-item');
    if (!authLI) return;

    const teacherBadge = isTeacher ? `<span class="badge-teacher-tag">Giáo viên</span>` : '';
    const teacherAdminLink = isTeacher 
      ? `<a href="admin-class.html" class="dropdown-item-link admin-menu-item ${isAdminClass ? 'active-item' : ''}"> Quản lý lớp học</a>` 
      : '';

    authLI.innerHTML = `
      <div class="user-profile-dropdown">
        <img class="menu-avatar-img" src="${avatar}" alt="Avatar">
        <div class="dropdown-menu-box">
          <div class="dropdown-info-header">
            <div class="dropdown-info-name"><span>${name}</span> ${teacherBadge}</div>
            <div class="dropdown-info-email">${email}</div>
          </div>
          <a href="profile.html" class="dropdown-item-link">Thông tin cá nhân</a>
          ${teacherAdminLink}
          <a href="my-books.html" class="dropdown-item-link">Sách của tôi</a>
          <a href="my-class.html" class="dropdown-item-link ${isClass ? 'active-item' : ''}">Lớp của bạn</a>
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
