// Cloudflare Worker - Contact Form Handler
// Module Worker format

export default {
  async fetch(request, env, ctx) {
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

      // Access secrets from env
      const botToken = env.TELEGRAM_BOT_TOKEN
      const chatId = env.TELEGRAM_CHAT_ID
      
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
}
