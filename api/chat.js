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
    // Sử dụng model gemini-1.5-flash chính thức
const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        system_instruction: {
          parts: [{
            text: "Bạn là Trợ lý Gia sư Toán của website 'Toán Anh Việt'. Hãy trả lời ngắn gọn, thân thiện, giải thích bài toán từng bước một. QUAN TRỌNG: Mọi công thức toán học BẮT BUỘC phải viết dưới dạng mã LaTeX nằm trong cặp dấu $ ví dụ $x^2 + 2x = 0$ hoặc $$ cho công thức dòng riêng."
          }]
        },
        contents: [{
          parts: [{ text: message }]
        }]
      })
    });

    const data = await response.json();

    // Nếu Google báo lỗi (ví dụ sai Key hoặc hết quota)
    if (data.error) {
      return res.status(200).json({ reply: `⚠️ Lỗi từ Google API: ${data.error.message}` });
    }

    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "Tớ chưa nghĩ ra lời giải, cậu hỏi lại nhé!";
    return res.status(200).json({ reply });

  } catch (error) {
    return res.status(200).json({ reply: `⚠️ Lỗi server: ${error.message}` });
  }
}
