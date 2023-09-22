// pages/api/webhook.js

export default async (req, res) => {
    // GitHubのWebhookからのリクエストを処理
    const event = req.headers['reload-starry-sky'];
    
    if (event === 'push') {
      // ページの再ビルドトリガーを実行
      // 例: npm run build または vercel のデプロイ API を呼び出す
    //   await runBuildProcess();
      
      // ページをリロードするスクリプトを実行
      sendReloadSignalToClient();
    }
  
    res.status(200).end();
  };
  