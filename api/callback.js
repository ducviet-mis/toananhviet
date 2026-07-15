// api/callback.js
export default async function handler(req, res) {
  const { code } = req.query;

  if (!code) {
    return res.status(400).send('Missing code parameter');
  }

  try {
    // 1. Gửi yêu cầu lấy Access Token từ GitHub bằng fetch thuần (không cần axios)
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

    // 2. Trả kết quả Token về cho Decap CMS ở trang Admin để tự động đăng nhập và đóng pop-up
    const content = `
      <script>
        const target = window.opener || window.parent;
        if (target) {
          target.postMessage(
            "authorization:github:success:${JSON.stringify({ token: access_token, provider: 'github' })}",
            "*"
          );
        } else {
          document.body.innerHTML = "Đăng nhập thành công! Bạn có thể đóng cửa sổ này.";
        }
      </script>
    `;

    res.setHeader('Content-Type', 'text/html');
    return res.status(200).send(content);

  } catch (err) {
    console.error(err);
    return res.status(500).send(`Internal Server Error: ${err.message}`);
  }
}
