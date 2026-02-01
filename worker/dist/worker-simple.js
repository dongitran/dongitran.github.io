// Cloudflare Worker - Contact Form
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  const cors = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  }

  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: cors })
  }

  if (request.method !== 'POST') {
    return json({ success: false, error: 'Method not allowed' }, 405, cors)
  }

  try {
    const { name, email, message } = await request.json()
    
    if (!name || !email || !message) {
      return json({ success: false, error: 'Missing fields' }, 400, cors)
    }

    // Get secrets from env
    const token = typeof TELEGRAM_BOT_TOKEN !== 'undefined' ? TELEGRAM_BOT_TOKEN : null
    const chatId = typeof TELEGRAM_CHAT_ID !== 'undefined' ? TELEGRAM_CHAT_ID : null
    
    if (!token || !chatId) {
      return json({ success: false, error: 'Not configured' }, 500, cors)
    }

    const text = `📧 Contact Form\n\n👤 ${name}\n📧 ${email}\n💬 ${message}`

    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text })
    })

    if (!res.ok) {
      return json({ success: false, error: 'Telegram error' }, 500, cors)
    }

    return json({ success: true, message: 'Sent!' }, 200, cors)

  } catch (err) {
    return json({ success: false, error: err.message }, 500, cors)
  }
}

function json(data, status, cors) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...cors, 'Content-Type': 'application/json' }
  })
}
