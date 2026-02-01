// Cloudflare Worker - Contact Form Handler
// Service Worker format with proper secret access

// Secrets are injected as globals by Cloudflare
// TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request, event))
})

async function handleRequest(request, event) {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  }

  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ success: false, error: 'Method not allowed' }), { 
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }

  try {
    const formData = await request.json()
    const { name, email, message } = formData

    if (!name || !email || !message) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Missing required fields' 
      }), { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // Access secrets from global scope
    const botToken = typeof self.TELEGRAM_BOT_TOKEN !== 'undefined' ? self.TELEGRAM_BOT_TOKEN : null
    const chatId = typeof self.TELEGRAM_CHAT_ID !== 'undefined' ? self.TELEGRAM_CHAT_ID : null
    
    if (!botToken || !chatId) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Telegram not configured' 
      }), { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }
    
    const telegramMessage = `📧 New Contact Form Submission

👤 Name: ${name}
📧 Email: ${email}
💬 Message:
${message}

🕐 Time: ${new Date().toLocaleString('en-US', { timeZone: 'Asia/Ho_Chi_Minh' })}`

    const telegramResponse = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: telegramMessage
      })
    })

    if (!telegramResponse.ok) {
      const errorData = await telegramResponse.text()
      console.error('Telegram error:', errorData)
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Failed to send message' 
      }), { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    return new Response(JSON.stringify({ 
      success: true, 
      message: 'Message sent successfully!' 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })

  } catch (error) {
    console.error('Worker error:', error)
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), { 
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
}
