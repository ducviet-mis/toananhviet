(function initUniversalFooter() {
  // 1. Tìm hoặc tự chèn thẻ <footer> nếu chưa có
  let siteFooter = document.querySelector('footer');
  if (!siteFooter) {
    siteFooter = document.createElement('footer');
    document.body.appendChild(siteFooter);
  }

  // 2. Nội dung Footer chuẩn 100% như Trang chủ
  siteFooter.innerHTML = `
    <div class="footer-container">
      <p>© 2026 Website Gia Sư Toán Anh Việt. Phát triển bởi Anh Việt.</p>
      <p class="footer-sub">Hotline/Zalo hỗ trợ: <b>0965193026</b> - Địa chỉ: Bắc Từ Liêm - Hà Nội</p>
    </div>
  `;

  // 3. Inject CSS Footer màu xanh đen đậm chuẩn Trang chủ
  if (!document.getElementById('universal-footer-style')) {
    const style = document.createElement('style');
    style.id = 'universal-footer-style';
    style.innerHTML = `
      footer {
        background-color: #0f172a !important; /* Màu xanh xám đen sang trọng */
        color: #94a3b8 !important;
        text-align: center !important;
        padding: 35px 20px !important;
        margin-top: 60px !important;
        width: 100% !important;
        box-sizing: border-box !important;
        border-top: 1px solid #1e293b !important;
      }
      .footer-container p {
        margin: 0 0 8px 0 !important;
        font-size: 14px !important;
        color: #cbd5e1 !important;
        font-family: 'Inter', sans-serif !important;
      }
      .footer-container p.footer-sub {
        font-size: 13px !important;
        color: #94a3b8 !important;
        margin-bottom: 0 !important;
      }
      .footer-container b {
        color: #38bdf8 !important; /* Highlight số Zalo/Hotline màu xanh sáng */
      }
    `;
    document.head.appendChild(style);
  }
})();
