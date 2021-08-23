const express = require("express");
const cors = require("cors");
const dialogflow = require("@google-cloud/dialogflow");

const app = express();
app.use(express.json());
app.use(cors());

// detectIntentがGETメソッドで呼び出せることを定義
app.get("/detectIntent", async (req, res) => {
  const sessionClient = new dialogflow.SessionsClient();
  // req.query.sessionIdはDialogflowのセッションID
  // 'YOUR PROJECT ID'は自分のDialogflowのプロジェクトIDで置換する
  const sessionPath = sessionClient.projectAgentSessionPath(
    // "YOUR PROJECT ID",
    req.query.sessionId
  );

  // パラメータとしてrequestオブジェクトを生成
  const request = {
    session: sessionPath,
    queryInput: {
      text: {
        text: req.query.inputMessage,
        languageCode: "ja-JP",
      },
    },
  };

  // Dialogflowへ、インテントを特定しにいく
  const responses = await sessionClient.detectIntent(request);
  const result = responses[0].queryResult;
  res.send({
    // Dialogflowから取得した返事の文字列を返却
    fulfillmentText: result.fulfillmentText,
  });
});

app.listen(process.env.PORT || 3000);
