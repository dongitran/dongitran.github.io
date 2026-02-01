// Cloudflare Worker - Contact Form Handler
// Service Worker format with global bindings

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
    return json({ error: 'Method not allowed' }, 405, cors)
  }

  try {
    const { name, email, message } = await request.json()
    
    if (!name || !email || !message) {
      return json({ error: 'Missing fields' }, 400, cors)
    }

    // Read secrets from global bindings (set in Cloudflare dashboard)
    const token = typeof TELEGRAM_BOT_TOKEN !== 'undefined' ? TELEGRAM_BOT_TOKEN : null
    const chatId = typeof TELEGRAM_CHAT_ID !== 'undefined' ? TELEGRAM_CHAT_ID : null
    
    if (!token || !chatId) {
      return json({ error: 'Not configured' }, 500, cors)
    }

    const text = `📧 New Contact Form\n\n👤 Name: ${name}\n📧 Email: ${email}\n💬 Message:\n${message}`

    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text })
    })

    if (!res.ok) {
      const errText = await res.text()
      console.log('Telegram error:', errText)
      return json({ error: 'Failed to send message' }, 500, cors)
    }

    return json({ success: true, message: 'Sent!' }, 200, cors)

  } catch (err) {
    console.log('Error:', err.message)
    return json({ error: err.message }, 500, cors)
  }
}

function json(data, status, cors) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...cors, 'Content-Type': 'application/json' }
  })
}
