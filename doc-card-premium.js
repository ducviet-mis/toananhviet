/**
 * doc-card-premium.js
 * Logic dùng chung để dựng thẻ tài liệu (.doc-card-premium).
 * Dùng cùng với doc-card-premium.css.
 *
 * Cách dùng ở mọi trang:
 *   container.innerHTML = list.map(DocCard.buildDocCardHTML).join('');
 * hoặc gọi buildDocCardHTML(...) với object tuỳ ý (xem bên dưới).
 */
(function (global) {
  // Quy tắc nhận diện loại đề để tô màu tab tương ứng
  const CATEGORY_RULES = [
    { keys: ['giữa kì 1', 'giữa kỳ 1', 'giữa hk1', 'gk1'], tab: 'GK1', className: 'tab-gk1' },
    { keys: ['cuối kì 1', 'cuối kỳ 1', 'cuối hk1', 'ck1'], tab: 'CK1', className: 'tab-ck1' },
    { keys: ['giữa kì 2', 'giữa kỳ 2', 'giữa hk2', 'gk2'], tab: 'GK2', className: 'tab-gk2' },
    { keys: ['cuối kì 2', 'cuối kỳ 2', 'cuối hk2', 'ck2'], tab: 'CK2', className: 'tab-ck2' },
    { keys: ['chuyên đề'], tab: 'CĐ', className: 'tab-chuyen' },
    { keys: ['đề cương'], tab: 'ĐC', className: 'tab-cuong' },
  ];

  function classifyCategory(rawText) {
    const text = String(rawText || '').toLowerCase();
    for (const rule of CATEGORY_RULES) {
      if (rule.keys.some((k) => text.includes(k))) return rule;
    }
    return { tab: 'ĐỀ', className: 'tab-default' };
  }

  function escapeHtml(value) {
    return String(value ?? '').replace(/[&<>"']/g, (m) => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
    }[m]));
  }

  /**
   * @param {Object} doc
   * @param {string} doc.grade      - Ví dụ: "Toán 8"
   * @param {string} doc.category   - Ví dụ: "Đề giữa kì 1" (dùng để chọn màu tab)
   * @param {string} doc.title      - Tiêu đề tài liệu
   * @param {string} doc.desc       - Mô tả ngắn
   * @param {string} doc.dateLabel  - Nhãn ngày đăng, ví dụ "2026-07-15" hoặc "Mới cập nhật"
   * @param {string} doc.link       - URL khi bấm vào thẻ
   * @param {string} [doc.actionLabel] - Chữ trên nút hành động, mặc định "Xem chi tiết"
   */
  function buildDocCardHTML(doc) {
    const { grade, category, title, desc, dateLabel, link, actionLabel } = doc;
    const meta = classifyCategory(category);
    const safeLink = String(link || '#').replace(/'/g, "\\'");

    return `
      <div class="doc-card-premium" tabindex="0" role="button"
           aria-label="${escapeHtml(title)}"
           onclick="window.location.href='${safeLink}'"
           onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();window.location.href='${safeLink}';}">
        <span class="card-tab ${meta.className}">${meta.tab}</span>
        <div class="card-meta">
          <span class="card-badge">${escapeHtml(grade)}</span>
          <span class="card-id">${escapeHtml(category)}</span>
        </div>
        <h3 class="card-title">${escapeHtml(title)}</h3>
        <p class="card-desc">${escapeHtml(desc)}</p>
        <div class="card-footer">
          <span class="card-date">📅 ${escapeHtml(dateLabel)}</span>
          <span class="card-action-btn">${escapeHtml(actionLabel || 'Xem chi tiết')} →</span>
        </div>
      </div>
    `;
  }

  global.DocCard = { buildDocCardHTML, classifyCategory };
})(window);
