// =============================================
// Firebase 專案設定檔
// =============================================
// 步驟：
// 1. 前往 https://console.firebase.google.com/
// 2. 建立新專案（例如：longfu-hub）
// 3. 點選「新增應用程式」→ 選 Web（</>）
// 4. 複製 firebaseConfig 物件，填入下方對應欄位
// =============================================

const firebaseConfig = {
  apiKey: "AIzaSyDopo2KqZG_f3A_aImoiyXjgH4SuGC6mP4",
  authDomain: "longfuhub.firebaseapp.com",
  projectId: "longfuhub",
  storageBucket: "longfuhub.firebasestorage.app",
  messagingSenderId: "931671518533",
  appId: "1:931671518533:web:a671e3d157a195961d222c",
  measurementId: "G-LT8KZ8S341"
};

// 初始化 Firebase
firebase.initializeApp(firebaseConfig);
