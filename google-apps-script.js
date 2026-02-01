// Google Apps Script for Contact Form
// 1. Create new Google Sheet
// 2. Extensions > Apps Script
// 3. Paste this code
// 4. Deploy > New Deployment > Web App
// 5. Copy URL and use in form

function doPost(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const data = JSON.parse(e.postData.contents);
  
  sheet.appendRow([
    new Date(),
    data.name,
    data.email,
    data.message
  ]);
  
  // Send Telegram notification
  const BOT_TOKEN = 'YOUR_BOT_TOKEN';
  const CHAT_ID = 'YOUR_CHAT_ID';
  const text = `📧 New Contact\n\n👤: ${data.name}\n📧: ${data.email}\n💬: ${data.message}`;
  
  UrlFetchApp.fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
    method: 'POST',
    payload: JSON.stringify({
      chat_id: CHAT_ID,
      text: text
    }),
    contentType: 'application/json'
  });
  
  return ContentService
    .createTextOutput(JSON.stringify({ success: true }))
    .setMimeType(ContentService.MimeType.JSON)
    .setHeaders({
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST'
    });
}

function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({ status: 'ok' }))
    .setMimeType(ContentService.MimeType.JSON);
}
