export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { message } = req.body;
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return res.status(200).json({ reply: "⚠️ Lỗi: Chưa tìm thấy GEMINI_API_KEY trên Vercel!" });
  }

  try {
    // Gọi endpoint v1 chuẩn chính thức của Google (Stable Release)
    const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{ 
            text: `Bạn là Trợ lý Gia sư Toán của website 'Toán Anh Việt'. Hãy trả lời ngắn gọn, thân thiện, giải thích bài toán từng bước một. Mọi công thức toán BẮT BUỘC nằm trong cặp dấu $ ví dụ $x^2 + 2x = 0$. Câu hỏi của học sinh: ${message}` 
          }]
        }]
      })
    });

    const data = await response.json();

    // Nếu Google báo lỗi (Key / Quota)
    if (data.error) {
      return res.status(200).json({ reply: `⚠️ Lỗi Google API (${data.error.code}): ${data.error.message}` });
    }

    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "Tớ chưa nghĩ ra lời giải, cậu hỏi lại nhé!";
    return res.status(200).json({ reply });

  } catch (error) {
    return res.status(200).json({ reply: `⚠️ Lỗi Server: ${error.message}` });
  }
}
