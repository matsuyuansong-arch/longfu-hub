// =============================================
// auth.js — 統一驗證與角色判斷邏輯
// 每個受保護的頁面都需要引用此檔案
// =============================================

// 角色代碼對應可存取的目錄前綴
// 新增角色時只需修改這裡
const ROLE_ACCESS = {
  "admin":        ["training", "travel", "brand", "notes", "kids"],
  "hotel-staff":  ["training"],
  "travel-staff": ["travel"],
  "brand-team":   ["brand"]
};

// 取得 Firebase Auth 與 Firestore 實例
const auth = firebase.auth();
const db   = firebase.firestore();

// ---- 公用函式 ----

/**
 * 從 Firestore 讀取指定使用者的角色
 * @param {string} uid - Firebase 使用者 UID
 * @returns {Promise<string|null>} 角色代碼，查無資料回傳 null
 */
async function getUserRole(uid) {
  try {
    const doc = await db.collection("users").doc(uid).get();
    if (doc.exists) {
      return doc.data().role || null;
    }
    return null;
  } catch (err) {
    console.error("讀取角色失敗：", err);
    return null;
  }
}

/**
 * 判斷某角色是否有權存取指定的內容目錄
 * @param {string} role    - 角色代碼
 * @param {string} section - 目錄名稱（例如 "training"）
 * @returns {boolean}
 */
function canAccess(role, section) {
  if (!role) return false;
  const allowed = ROLE_ACCESS[role] || [];
  return allowed.includes(section);
}

/**
 * 強制登入守衛：
 * 若使用者未登入，立刻跳回 index.html。
 * 若已登入，回傳 { user, role } 供頁面使用。
 *
 * 用法（在需要保護的頁面最上方呼叫）：
 *   requireLogin().then(({ user, role }) => { ... });
 *
 * @param {string} [section] - 若傳入，會額外檢查角色是否有權存取
 * @returns {Promise<{user, role}>}
 */
function requireLogin(section) {
  return new Promise((resolve) => {
    // onAuthStateChanged 確保 Firebase 初始化完成後才判斷
    auth.onAuthStateChanged(async (user) => {
      if (!user) {
        // 未登入 → 回到登入頁
        window.location.href = "/index.html";
        return;
      }

      const role = await getUserRole(user.uid);

      // 若傳入 section，檢查角色權限
      if (section && !canAccess(role, section)) {
        document.body.innerHTML = `
          <div class="msg-box error">
            <p>你沒有存取此頁面的權限。</p>
            <a href="/portal.html">← 返回首頁</a>
          </div>`;
        return;
      }

      resolve({ user, role });
    });
  });
}

/**
 * 登出並跳回登入頁
 */
async function signOut() {
  await auth.signOut();
  window.location.href = "/index.html";
}
