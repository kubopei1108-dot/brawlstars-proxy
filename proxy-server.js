const express = require('express');
const axios = require('axios');
const app = express();

const BRAWL_STARS_API_BASE = 'https://api.brawlstars.com/v1';
const API_KEY = process.env.BRAWL_STARS_API_KEY;

// CORS対応（GASから呼び出す場合も念のため）
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

app.use(express.json());

// ヘルスチェック用エンドポイント
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Brawl Stars Proxy Server is running' });
});

// プロキシエンドポイント
app.all('/api/*', async (req, res) => {
  try {
    // パスを取得（/api/rankings/global/players → /rankings/global/players）
    const path = req.path.replace('/api', '');
    
    // クエリパラメータを構築
    const queryString = Object.keys(req.query).length > 0 
      ? '?' + new URLSearchParams(req.query).toString() 
      : '';
    
    // 完全なURLを構築
    const url = `${BRAWL_STARS_API_BASE}${path}${queryString}`;
    
    console.log(`Proxying request to: ${url}`);
    
    // Brawl Stars APIにリクエスト
    const response = await axios({
      method: req.method,
      url: url,
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
        'User-Agent': 'BrawlPicker-Proxy/1.0'
      },
      data: req.body || undefined,
      timeout: 10000 // 10秒タイムアウト
    });
    
    res.json(response.data);
  } catch (error) {
    console.error('Proxy error:', error.message);
    res.status(error.response?.status || 500).json({
      error: error.message,
      details: error.response?.data || null
    });
  }
});

// エラーハンドリング
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: err.message
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Brawl Stars Proxy Server running on port ${PORT}`);
  console.log(`API Key configured: ${API_KEY ? 'Yes' : 'No'}`);
});
