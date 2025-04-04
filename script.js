document.getElementById('register-form').addEventListener('submit', async function (e) {
  e.preventDefault();

  const name = document.getElementById('discord-name').value;
  const status = document.getElementById('status');
  status.textContent = 'お待ちください...';

  // 🔒 デバイスIDはC#アプリ側からURLのクエリで送ってくる前提とする
  const urlParams = new URLSearchParams(window.location.search);
  const deviceId = urlParams.get('device');

  if (!deviceId) {
    status.textContent = 'デバイスIDが見つかりません。';
    return;
  }

  // 🚀 登録用APIにPOST
  try {
    const res = await fetch('https://your-server.com/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ discord: name, deviceId: deviceId })
    });

    const result = await res.json();
    if (result.success) {
      status.textContent = '登録完了！ダウンロードページに移動します...';
      setTimeout(() => {
        window.location.href = 'https://your-download-page.com';
      }, 2000);
    } else {
      status.textContent = '登録に失敗しました: ' + result.message;
    }
  } catch (err) {
    status.textContent = 'エラーが発生しました。';
    console.error(err);
  }
});
