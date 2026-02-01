# Contact Form Backend - Cloudflare Worker

Backend xử lý form liên hệ cho portfolio, deploy trên Cloudflare Workers (FREE).

## 🚀 Quick Deploy

### 1. Chuẩn bị
```bash
cd worker
npm install
```

### 2. Login Cloudflare
```bash
npx wrangler login
```

### 3. Deploy Worker
```bash
npx wrangler deploy
```

Sau khi deploy, bạn sẽ nhận được URL dạng:
```
https://contact-form.xxx.workers.dev
```

### 4. Cập nhật Portfolio
Copy URL worker và paste vào `index.html`:
```javascript
const WORKER_URL = 'https://contact-form.xxx.workers.dev';
```

### 5. Setup Notifications

#### Option A: Telegram (Khuyến nghị - Đơn giản)
```bash
# Tạo bot với @BotFather, lấy token
npx wrangler secret put TELEGRAM_BOT_TOKEN
# Nhập: 123456789:ABCdefGHIjklMNOpqrsTUVwxyz

# Lấy chat ID từ @userinfobot  
npx wrangler secret put TELEGRAM_CHAT_ID
# Nhập: 123456789
```

#### Option B: Email (Resend)
```bash
# Đăng ký https://resend.com, lấy API key
npx wrangler secret put RESEND_API_KEY
# Nhập: re_xxxxxx

npx wrangler secret put TO_EMAIL
# Nhập: dongtranthienio@gmail.com
```

#### Option C: Cả hai
Setup cả Telegram và Email để nhận notifications ở cả hai nơi.

### 6. Test
```bash
# Chạy local test
npx wrangler dev

# Gửi test request
curl -X POST http://localhost:8787 \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com","message":"Hello"}'
```

## 📁 Structure
```
worker/
├── src/
│   └── index.js      # Worker code
├── wrangler.toml     # Config
├── package.json      # Dependencies
└── README.md         # This file
```

## 🔧 API

### POST /
Content-Type: `application/json`

Body:
```json
{
  "name": "John Doe",
  "email": "john@example.com", 
  "message": "Hello!"
}
```

Response:
```json
{
  "success": true,
  "message": "Message sent successfully!"
}
```

## 🆓 Free Limits
- Cloudflare Workers: 100,000 requests/day
- Telegram Bot API: Unlimited
- Resend: 3,000 emails/month

## 🔒 Security
- CORS enabled cho GitHub Pages
- Input validation
- Secrets stored securely (wrangler secret)
