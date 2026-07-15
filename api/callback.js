// api/callback.js
export default async function handler(req, res) {
  const { code } = req.query;
  const client_id = process.env.OAUTH_CLIENT_ID;
  const client_secret = process.env.OAUTH_CLIENT_SECRET;

  try {
    const response = await fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        client_id,
        client_secret,
        code,
      }),
    });

    const data = await response.json();

    if (data.error) {
      return res.status(400).send(`Xác thực thất bại: ${data.error_description}`);
    }

    // Trả kết quả về cho Netlify/Decap CMS trên trình duyệt
    res.send(`
      <script>
        const target = window.opener ? window.opener : window.parent;
        target.postMessage('authorization:github:success:${JSON.stringify({
          token: data.access_token,
          provider: "github",
        })}', '*');
      </script>
    `);
  } catch (error) {
    res.status(500).send("Lỗi hệ thống cổng xác thực.");
  }
}
