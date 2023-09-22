// import { NextApiRequest, NextApiResponse } from "next";

export default async (req, res) => {
  try {
    // リロードをトリガーするための処理を行う
    // ここでクライアント側の特定のページに通知する方法について考えます

    // HTTPステータス200を返してリクエストを受け入れる
    res.status(200).end();
  } catch (error) {
    console.error("Webhook error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
