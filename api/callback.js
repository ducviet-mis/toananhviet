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

    // Tạo nội dung HTML chứa script gửi token an toàn và tự động đóng cửa sổ sau 1 giây
    const content = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Authorizing...</title>
      </head>
      <body>
        <div style="text-align: center; margin-top: 50px; font-family: sans-serif;">
          <h3>Đăng nhập thành công!</h3>
          <p>Đang chuyển hướng về trang quản trị, cửa sổ này sẽ tự đóng...</p>
        </div>
        <script>
          const target = window.opener || window.parent;
          if (target) {
            // Gửi tin nhắn về cho trang Admin chính
           target.postMessage(
  "authorization:github:success:" + JSON.stringify(dataToSend),
  "*"
);
            // Ép cửa sổ này tự đóng ngay sau khi gửi tin nhắn
            setTimeout(() => {
              window.close();
            }, 1000);
          } else {
            document.body.innerHTML = "Không tìm thấy trang quản trị gốc. Bạn có thể tự đóng cửa sổ này.";
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
