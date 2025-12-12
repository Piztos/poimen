const { app, BrowserWindow, ipcMain, shell } = require('electron')
const path = require('path')
const { spawn } = require('child_process')

let mainWindow
let backendProcess

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
      webSecurity: true
    },
    backgroundColor: '#0f0f1e',
    icon: path.join(__dirname, 'assets', 'icon.png'),
    title: 'Poimén - Estudos Bíblicos Reformados',
    show: false
  })

  // Carregar frontend compilado
  const frontendPath = path.join(__dirname, '..', 'frontend', 'dist', 'index.html')
  mainWindow.loadFile(frontendPath)

  // Mostrar janela quando estiver pronta
  mainWindow.once('ready-to-show', () => {
    mainWindow.show()
  })

  // Abrir links externos no navegador padrão
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url)
    return { action: 'deny' }
  })

  // DevTools apenas em desenvolvimento
  if (process.env.NODE_ENV === 'development') {
    mainWindow.webContents.openDevTools()
  }

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

function startBackend() {
  const backendPath = path.join(__dirname, '..', 'backend', 'src', 'server.js')
  
  backendProcess = spawn('node', [backendPath], {
    env: { ...process.env, PORT: '5000' },
    stdio: 'inherit'
  })

  backendProcess.on('error', (error) => {
    console.error('Erro ao iniciar backend:', error)
  })

  console.log('✅ Backend iniciado na porta 5000')
}

function stopBackend() {
  if (backendProcess) {
    backendProcess.kill()
    backendProcess = null
    console.log('🛑 Backend encerrado')
  }
}

// Inicializar aplicação
app.whenReady().then(() => {
  startBackend()
  
  // Aguardar backend inicializar antes de criar janela
  setTimeout(() => {
    createWindow()
  }, 2000)

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

// Encerrar quando todas as janelas forem fechadas
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    stopBackend()
    app.quit()
  }
})

// Encerrar backend ao sair
app.on('before-quit', () => {
  stopBackend()
})

// IPC Handlers
ipcMain.handle('open-external', async (event, url) => {
  await shell.openExternal(url)
})

ipcMain.handle('get-app-version', () => {
  return app.getVersion()
})

ipcMain.handle('get-app-path', () => {
  return app.getAppPath()
})

// Tratamento de erros
process.on('uncaughtException', (error) => {
  console.error('Erro não capturado:', error)
})

process.on('unhandledRejection', (reason, promise) => {
  console.error('Promise rejeitada não tratada:', promise, 'razão:', reason)
})
