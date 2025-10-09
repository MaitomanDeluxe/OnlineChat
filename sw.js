// sw.js

// サービスワーカーがインストールされたときに実行
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Install');
  self.skipWaiting();
});

// サービスワーカーがアクティブになったときに実行
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activate');
  event.waitUntil(self.clients.claim());
});

// 通知がクリックされたときの処理
self.addEventListener('notificationclick', (event) => {
  console.log('[Service Worker] Notification click received.');
  event.notification.close(); // 通知を閉じる

  // 通知クリックでPWAまたはタブをフォーカスする
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then((clientList) => {
      // 既存のウィンドウがある場合は、それをフォーカスする
      for (const client of clientList) {
        if (client.url.includes('/') && 'focus' in client) {
          return client.focus();
        }
      }
      // 既存のウィンドウがない場合は、新しく開く
      if (clients.openWindow) {
        return clients.openWindow('./'); // アプリのベースパスを開く
      }
    })
  );
});
