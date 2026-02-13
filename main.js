
const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 1024,
    minHeight: 768,
    frame: false, // إزالة إطار الويندوز التقليدي لاستخدام شريط مخصص
    backgroundColor: '#050507',
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
    icon: path.join(__dirname, 'icon.ico')
  });

  // في بيئة التطوير نقوم بتحميل الرابط المحلي
  win.loadFile('index.html');
  
  // إخفاء شريط القوائم الافتراضي
  win.setMenuBarVisibility(false);
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
