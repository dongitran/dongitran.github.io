// Cloudflare Worker - Contact Form with Telegram
// Deploy with: wrangler deploy

export default {
  async fetch(request, env) {
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    if (request.method !== 'POST') {
      return json({ success: false, error: 'Method not allowed' }, 405, corsHeaders);
    }

    try {
      const { name, email, message } = await request.json();

      if (!name || !email || !message) {
        return json({ success: false, error: 'Missing fields' }, 400, corsHeaders);
      }

      // HARDCODED TOKEN - will be embedded at deploy time
      const TELEGRAM_BOT_TOKEN = '8079513513:AAGESFqQDxdO7EA62qTh8iKq4eV6LL8Ds4E';
      const TELEGRAM_CHAT_ID = '1739190630';

      const text = `📧 New Portfolio Contact\n\n👤 Name: ${name}\n📧 Email: ${email}\n💬 Message:\n${message}\n\n🕐 ${new Date().toLocaleString('en-US', { timeZone: 'Asia/Ho_Chi_Minh' })}`;

      const telegramRes = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text: text
        })
      });

      if (!telegramRes.ok) {
        const err = await telegramRes.text();
        console.error('Telegram error:', err);
        return json({ success: false, error: 'Failed to send notification' }, 500, corsHeaders);
      }

      return json({ success: true, message: 'Message sent!' }, 200, corsHeaders);

    } catch (err) {
      console.error('Error:', err);
      return json({ success: false, error: err.message }, 500, corsHeaders);
    }
  }
};

function json(data, status, headers) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...headers, 'Content-Type': 'application/json' }
  });
}
