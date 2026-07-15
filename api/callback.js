// api/callback.js
export default async function handler(req, res) {
  const { code } = req.query;

  if (!code) {
    return res.status(400).send('Missing code parameter');
  }

  try {
    // 1. Gửi yêu cầu lấy Access Token từ GitHub
    const response = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        client_id: process.env.OAUTH_CLIENT_ID,
        client_secret: process.env.OAUTH_CLIENT_SECRET,
        code,
      }),
    });

    const data = await response.json();
    const { access_token, error, error_description } = data;

    if (error) {
      return res.status(400).send(`GitHub OAuth Error: ${error_description || error}`);
    }

    // 2. Định nghĩa dữ liệu gửi về cho Admin
    const tokenData = {
      token: access_token,
      provider: "github"
    };

    // Tạo giao diện chẩn đoán lỗi trực quan
    const content = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Xác thực hệ thống...</title>
        <style>
          body { font-family: sans-serif; text-align: center; margin-top: 50px; background: #f9f9f9; color: #333; }
          .card { max-width: 500px; margin: 0 auto; padding: 20px; background: white; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
          .status { font-weight: bold; padding: 8px; margin: 10px 0; border-radius: 4px; }
          .success { background: #d4edda; color: #155724; }
          .info { background: #e2e3e5; color: #383d41; }
          .error { background: #f8d7da; color: #721c24; }
        </style>
      </head>
      <body>
        <div class="card">
          <h2>Hệ thống đăng nhập Toán Anh Việt</h2>
          <div id="step1" class="status success">✓ Đã lấy thành công Token bảo mật từ GitHub!</div>
          <div id="step2" class="status info">Đang kiểm tra kết nối với trang gốc...</div>
          <div id="step3" class="status info">Đang gửi tín hiệu đăng nhập...</div>
        </div>

        <script>
          const step2 = document.getElementById('step2');
          const step3 = document.getElementById('step3');

          // Kiểm tra xem cửa sổ mẹ (opener) có tồn tại và không bị chặn không
          if (window.opener) {
            step2.className = "status success";
            step2.innerHTML = "✓ Đã tìm thấy trang Admin gốc!";

            try {
              const dataToSend = {
                token: "${access_token}",
                provider: "github"
              };
              
              // Gửi tin nhắn về trang chính
              window.opener.postMessage(
                "authorization:github:success:" + JSON.stringify(dataToSend),
                "*"
              );
              
              step3.className = "status success";
              step3.innerHTML = "✓ Đã gửi dữ liệu đăng nhập thành công! Đang tự đóng...";

              // Tự động đóng sau 1.5 giây
              setTimeout(() => {
                window.close();
              }, 1500);

            } catch (e) {
              step3.className = "status error";
              step3.innerHTML = "❌ Lỗi gửi tin nhắn: " + e.message;
            }
          } else {
            step2.className = "status error";
            step2.innerHTML = "❌ Không tìm thấy trang Admin gốc (window.opener bị null)! Trình duyệt của bạn đã chặn quyền liên kết giữa các tab.";
            step3.className = "status error";
            step3.innerHTML = "Khắc phục: Hãy thử tắt các tiện ích chặn quảng cáo (Adblock) hoặc đổi sang trình duyệt khác (Edge, Firefox) để thử lại.";
          }
        </script>
      </body>
      </html>
    `;

    res.setHeader('Content-Type', 'text/html');
    return res.status(200).send(content);

  } catch (err) {
    console.error(err);
    return res.status(500).send(`Internal Server Error: ${err.message}`);
  }
}
