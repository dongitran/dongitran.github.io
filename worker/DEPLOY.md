# Contact Form Deployment Guide

## ⚠️ Lưu ý
Cần đăng nhập Cloudflare account để deploy worker. Tôi không thể làm thay vì cậu.

## 🚀 Deploy Steps (Chỉ 3 lệnh)

### 1. Vào thư mục worker
```bash
cd ~/clawd/demo/portfolio-dongtran/worker
```

### 2. Login Cloudflare
```bash
npx wrangler login
```
- Mở browser → click "Authorize"

### 3. Deploy
```bash
npx wrangler deploy
```

Sau khi deploy xong, copy URL (dạng `https://contact-form.xxx.workers.dev`)

### 4. Setup Telegram Notifications
```bash
# Tạo bot với @BotFather → lấy token
npx wrangler secret put TELEGRAM_BOT_TOKEN

# Lấy chat ID từ @userinfobot
npx wrangler secret put TELEGRAM_CHAT_ID
```

### 5. Update Portfolio
Sửa file `index.html`:
```javascript
const WORKER_URL = 'https://contact-form.xxx.workers.dev'; // URL vừa copy
```

### 6. Push lại GitHub
```bash
git add .
git commit -m "Update: Worker URL"
git push origin main
```

## ✅ Test
Vào https://dongitran.github.io/ → điền form → submit → check Telegram!

---

**Tóm lại:** Tôi đã chuẩn bị sẵn code, cậu chỉ cần chạy 3 lệnh deploy + setup secrets là xong!
