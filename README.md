# Brawl Stars API Proxy Server

GAS（Google Apps Script）からBrawl Stars APIを呼び出すためのプロキシサーバーです。

## セットアップ

### Railway にデプロイ

1. Railwayアカウントを作成: https://railway.app/
2. 新しいプロジェクトを作成
3. GitHubリポジトリと連携
4. 環境変数 `BRAWL_STARS_API_KEY` を設定
5. デプロイ完了後、ドメインを取得

## 使用方法

プロキシサーバーのURL: `https://your-app.railway.app`

エンドポイント例:
- `GET /api/rankings/global/players?limit=200`
- `GET /api/players/%23PLAYER_TAG`
- `GET /api/players/%23PLAYER_TAG/battlelog`
