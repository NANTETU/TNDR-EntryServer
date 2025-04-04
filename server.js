const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();

// データベース接続 (MongoDBのURLを設定)
mongoose.connect('mongodb://localhost:27017/taiko_registration', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch((err) => console.log(err));

// ミドルウェア設定
app.use(bodyParser.json());

// スキーマとモデルの定義
const registrationSchema = new mongoose.Schema({
  discordUsername: { type: String, required: true },
  ipAddress: { type: String, required: true },
  password: { type: String, required: true }
});

const Registration = mongoose.model('Registration', registrationSchema);

// 登録情報を保存するAPI
app.post('/register', (req, res) => {
  const { discordUsername, ipAddress, password } = req.body;

  if (!discordUsername || !ipAddress || !password) {
    return res.status(400).send('全てのフィールドが必要です');
  }

  const newRegistration = new Registration({
    discordUsername,
    ipAddress,
    password
  });

  newRegistration.save()
    .then((data) => res.status(200).send('登録完了しました！'))
    .catch((err) => res.status(500).send('サーバーエラーが発生しました'));
});

// サーバーの起動
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`サーバーがポート${PORT}で起動しました`);
});
