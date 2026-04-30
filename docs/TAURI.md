# Configuracion Tauri - Aether Panel

## Indice

1. [Introduccion](#introduccion)
2. [Estructura de Tauri](#estructura-de-tauri)
3. [Configuracion Principal](#configuracion-principal)
4. [Permisos y Capabilities](#permisos-y-capabilities)
5. [Plugins](#plugins)
6. [Build para Diferentes Plataformas](#build-para-diferentes-plataformas)
7. [Android](#android)
8. [Windows](#windows)
9. [macOS](#macos)
10. [Troubleshooting](#troubleshooting)

---

## 1. Introduccion

Tauri es el framework usado para empaquetar la aplicacion web como aplicacion de escritorio. Esta configuracion permite generar ejecutables para Linux, Windows, macOS y Android.

### versiones Utilizadas

| Componente | Version |
|------------|---------|
| Tauri CLI | 2.x |
| Tauri Core | 2.10.x |
| Rust | 1.95.x |
| WebKit2GTK | 2.0.x |

---

## 2. Estructura de Tauri

```
src-tauri/
├── src/                  # Codigo fuente Rust
│   ├── main.rs          # Entry point
│   └── lib.rs          # Biblioteca principal
├── capabilities/        # Permisos de la aplicacion
│   └── default.json
├── icons/              # Iconos para todas las plataformas
├── Cargo.toml          # Dependencias Rust
├── build.rs           # Script de build
├── tauri.conf.json    # Configuracion principal
└── .gitignore        # Ignorar archivos de build
```

---

## 3. Configuracion Principal

### tauri.conf.json

```json
{
  "$schema": "../node_modules/@tauri-apps/cli/config.schema.json",
  "productName": "AetherPanel",
  "version": "0.1.0",
  "identifier": "com.aether.panel",
  "build": {
    "frontendDist": "../dist",
    "devUrl": "http://localhost:9002",
    "beforeDevCommand": "npm run dev",
    "beforeBuildCommand": "npm run build"
  },
  "app": {
    "windows": [
      {
        "title": "Aether Panel",
        "width": 1280,
        "height": 800,
        "minWidth": 800,
        "minHeight": 600,
        "resizable": true,
        "fullscreen": false,
        "center": true
      }
    ],
    "security": {
      "csp": "default-src 'self'; connect-src 'self' http: https: ws: wss:; img-src 'self' data: https:; style-src 'self' 'unsafe-inline'; script-src 'self'"
    }
  },
  "bundle": {
    "active": true,
    "targets": "all",
    "icon": [
      "icons/32x32.png",
      "icons/128x128.png",
      "icons/128x128@2x.png",
      "icons/icon.icns",
      "icons/icon.ico"
    ]
  }
}
```

### Explicacion de Parametros

| Parametro | Descripcion |
|----------|-------------|
| `productName` | Nombre del producto |
| `identifier` | Identificador unico (formato inverso de dominio) |
| `frontendDist` | Carpeta del build de Astro |
| `devUrl` | URL de desarrollo |
| `windows[]` | Configuracion de ventanas |

---

## 4. Permisos y Capabilities

### default.json

```json
{
  "identifier": "default",
  "description": "Permisos por defecto",
  "windows": ["main"],
  "permissions": [
    "core:default",
    "http:default",
    "http:allow-fetch",
    "http:allow-fetch-send"
  ]
}
```

### Permisos Disponibles

#### HTTP

| Permiso | Descripcion |
|---------|-------------|
| http:default | Permisos HTTP basicos |
| http:allow-fetch | Permite hacer peticiones fetch |
| http:allow-fetch-send | Permite enviar datos en peticion |

#### Core

| Permiso | Descripcion |
|---------|-------------|
| core:default | Permisos basicos |
| core:window:default | Permisos de ventana |

---

## 5. Plugins

### Cargo.toml

```toml
[dependencies]
tauri = { version = "2.10.3" }
tauri-plugin-http = "2"
tauri-plugin-log = "2"
```

### lib.rs

```rust
use tauri::Manager;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_http::init())
        .plugin(tauri_plugin_log::Builder::default()
            .level(log::LevelFilter::Info)
            .build())
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
```

---

## 6. Build para Diferentes Plataformas

### Linux (Desktop)

**Requisitos:**
- Linux ( Fedora, Ubuntu, Debian, etc )
- GTK3 desarrollo libraries

**Comando:**
```bash
npm run tauri:build
```

**Output:**
- `src-tauri/target/release/bundle/deb/AetherPanel_0.1.0_amd64.deb`
- `src-tauri/target/release/bundle/appimage/AetherPanel_0.1.0.AppImage`

---

## 7. Android

### Instalacion de Android SDK

```bash
# 1. Instalar Java
sudo dnf install java-17-openjdk java-17-openjdk-devel

# 2. Descargar Android command-line tools
mkdir -p ~/android-sdk/cmdline-tools
cd ~/android-sdk/cmdline-tools
wget https://dl.google.com/android/repository/commandlinetools-linux-11076708_latest.zip
unzip commandlinetools-linux-11076708_latest.zip
mv cmdline-tools latest

# 3. Configurar PATH
echo 'export ANDROID_HOME="$HOME/android-sdk"' >> ~/.bashrc
echo 'export PATH="$PATH:$ANDROID_HOME/cmdline-tools/latest/bin"' >> ~/.bashrc
source ~/.bashrc

# 4. Instalar componentes
yes | sdkmanager --licenses >/dev/null 2>&1
sdkmanager "platform-tools" "platforms;android-34" "build-tools;34.0.0"
```

### Agregar Targets de Rust

```bash
source ~/.cargo/env
rustup target add aarch64-linux-android armv7-linux-androideabi i686-linux-android x86_64-linux-android
```

### Build

```bash
npm run tauri:build -- --target aarch64-linux-android
```

**Output:**
- `src-tauri/target/release/bundle/android/*.apk`

### Configuracion Adicional (tauri.conf.json)

```json
"app": {
  "android": {
    "webviewInstallUrl": "https://github.com/nicklockwood/WebViewInstaller/releases/download/5.0/WebView.apk"
  }
}
```

---

## 8. Windows

### Requisitos

- Windows 10/11
- WebView2 Runtime

### Build

```bash
npm run tauri:build
```

**Output:**
- `src-tauri/target/release/bundle/msi/*.msi`
- `src-tauri/target/release/bundle/nsis/*.exe`

---

## 9. macOS

### Requisitos

- macOS 10.15+
- Xcode

### Build

```bash
npm run tauri:build
```

**Output:**
- `src-tauri/target/release/bundle/dmg/*.dmg`

---

## 10. Troubleshooting

### Error: Librerias GTK no encontradas

**Fedora:**
```bash
sudo dnf install gtk3-devel cairo-devel pango-devel gdk-pixbuf2-devel atk-devel
```

**Ubuntu/Debian:**
```bash
sudo apt install libgtk-3-dev libcairo2-dev libpango1.0-dev libgdk-pixbuf-2.0-dev
```

### Error: Wayland display en Linux

```bash
GDK_BACKEND=x11 ./src-tauri/target/release/app
```

### Error: Permission deny

```bash
chmod +x src-tauri/target/release/app
```

### Compilacion muy lenta

Usar `cargo build --release` primero para cachear dependencias.

### Error: Target no disponible

Verificar targets instalados:
```bash
rustup target list --installed
```

Agregar target faltante:
```bash
rustup target add aarch64-linux-android
```