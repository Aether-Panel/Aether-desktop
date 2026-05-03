# Guía de Preparación del Entorno Windows para Aether Panel

## Introducción

Esta guía cubre la configuración completa del entorno de desarrollo Windows para compilar y ejecutar la aplicación Tauri.

---

## 1. Dependencias Requeridas

### 1.1 Visual Studio Build Tools 2022

**Descargar**: [Visual Studio Build Tools](https://visualstudio.microsoft.com/visual-cpp-build-tools/)

**Componentes obligatorios**:
- ✅ **"Desktop development with C++"** ( workloads )
- ✅ **"Windows 10/11 SDK"** (10.0.22621.0 o superior)
- ✅ **"MSVC v143 - VS 2022 C++ x64/x86 build tools"**
- ✅ **"C++ ATL for latest build tools"**

> **Importante**: Sin VS Build Tools, Cargo no podrá compilar crates de Rust que dependan de código C++.

---

### 1.2 Rust (via rustup)

**Instalar rustup**:
```powershell
# Ejecutar en PowerShell como Administrador
Invoke-WebRequest -Uri https://win.rustup.rs -OutFile rustup-init.exe
.\rustup-init.exe -y default
```

**Verificar instalación**:
```powershell
rustc --version
cargo --version
```

**Añadir target Windows**:
```powershell
rustup target add x86_64-pc-windows-msvc
```

---

### 1.3 WebView2 Runtime

**Requisito**: Windows 10/11 (ya viene preinstalado en Windows 11)

**Descargar manualmente** (si es necesario):
- [WebView2 Runtime](https://developer.microsoft.com/en-us/microsoft-edge/webview2/)

**Verificar instalación**:
```powershell
# En PowerShell
Get-ItemProperty "HKLM:\SOFTWARE\WOW6432Node\Microsoft\EdgeUpdate\Clients\{F3017226-FE2A-4295-8BDF-00C3A9A7E7C5}" -ErrorAction SilentlyContinue
```

---

### 1.4 Node.js y pnpm

**Node.js** (v18+ LTS):
- [Descargar Node.js](https://nodejs.org/)

**pnpm**:
```powershell
npm install -g pnpm
```

---

## 2. Configuración del Entorno

### 2.1 Variables de Entorno

Asegurar que estas rutas están en PATH:
```
C:\Program Files\Rust\.cargo\bin
C:\Program Files\nodejs\
```

### 2.2 Permisos de Ejecución

En PowerShell (como Administrador):
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

---

## 3. Verificación del Entorno

### 3.1 Prueba de Compilación Rust

```powershell
cd src-tauri
cargo check
```

Esto descarga dependencias y verifica que el código Rust compila.

### 3.2 Ejecución en Desarrollo

```powershell
npm run tauri dev
```

Esto:
1. Compila el frontend (Astro)
2. Compila el backend (Rust)
3. Ejecuta la aplicación en ventana

---

## 4. Persistencia y Configuración de Red

### 4.1 localStorage

La aplicación guarda configuración en `localStorage`:

| Clave | Descripción |
|-------|-------------|
| `app-server-config` | `{ serverUrl: string, port: string }` |

**Compatibilidad Windows**: ✅ Compatible al 100%

- `localStorage` es una API del navegador
- WebView2 la soporta completamente
- No hay diferencias entre Windows/Linux/macOS

### 4.2 Políticas de Red

**WebView2 y red local**:

- ✅ Permite conexiones HTTP/HTTPS a servidores locales
- ✅ Soporta WebSocket (WS/WSS)
- ⚠️ Puede requerir configuración de Firewall para puertos externos

**CSP configurado**:
```
connect-src 'self' http: https: ws: wss:
```
- Permite conexiones HTTP/HTTPS a cualquier servidor
- Permite WebSocket a cualquier servidor

### 4.3 Puertos Comunes

| Puerto | Protocolo | Uso |
|--------|----------|-----|
| 80 | HTTP | Servidor web |
| 443 | HTTPS | Servidor seguro |
| 3000-9999 | custom | Aplicaciones personalizadas |

**Nota Windows**: Los puertos <1024 requieren elevación (Admin).

---

## 5. Generación del Instalador

### 5.1 Build de Producción

```powershell
npm run tauri build
```

### 5.2 Targets Disponibles

**Windows** (tauri.conf.json):
```json
"bundle": {
  "targets": ["msi", "nsis"]
}
```

| Target | Tipo | Instalador |
|--------|------|------------|
| `msi` | Windows Installer | `.msi` |
| `nsis` | Nullsoft Installer | `.exe` (NSIS) |

### 5.3 Output

Ubicación de los binaries:
```
src-tauri/target/release/bundle/
├── msi/
│   └── AetherPanel_1.0.0_x64-setup.msi
└── nsis/
    └── AetherPanel_1.0.0_x64-setup.exe
```

### 5.4 Build Solo MSI

```powershell
npm run tauri build -- --bundles msi
```

### 5.5 Build Solo NSIS

```powershell
npm run tauri build -- --bundles nsis
```

---

## 6. Solución de Problemas

### 6.1 Error: "LINK : fatal error LNK1181"

**Causa**: No están instaladas las VS Build Tools.

**Solución**: Instalar Visual Studio Build Tools con componentes C++.

---

### 6.2 Error: "WebView2 not found"

**Causa**: WebView2 Runtime no está instalado.

**Solución**: Instalar WebView2 Runtime.

---

### 6.3 Error: "cargo command not found"

**Causa**: Rust no está en PATH.

**Solución**: Añadir al PATH:
```powershell
# En PowerShell
$env:PATH += ";$env:USERPROFILE\.cargo\bin"
```

---

### 6.4 Error: "permission denied" al compilar

**Causa**: Antivirus bloqueando compilación.

**Solución**: Añadir exceptions en Windows Defender.

---

### 6.5 Error de CSP en WebView2

Si hay problemas con conexiones locales, el CSP ya permite:
```
connect-src 'self' http: https: ws: wss:
```

Para desarrollo local, puede ser necesario ajustar el CSP temporalmente.

---

## 7. Configuración Multiplataforma

### 7.1 tauri.conf.json - Resumen

| Campo | Linux | Windows | macOS |
|-------|-------|---------|-------|
| `productName` | ✅ | ✅ | ✅ |
| `identifier` | ✅ | ✅ | ✅ |
| `targets` | all | msi, nsis | dmg |
| `icon.ico` | - | ✅ | - |
| `icon.icns` | - | - | ✅ |

### 7.2 Iconos Requeridos

| Archivo | Plataforma | Tamaño |
|---------|-----------|--------|
| `icon.ico` | Windows | 256x256, 48x48, 32x32, 16x16 |
| `icon.icns` | macOS | 512x512, 256x256, 128x128, 64x64, 32x32, 16x16 |
| `icon.png` | Linux | 512x512 |

### 7.3 Iconos Existentes

```
src-tauri/icons/
├── 32x32.png
├── 128x128.png
├── 128x128@2x.png
├── icon.ico          ✅ (Windows)
├── icon.icns         ✅ (macOS)
└── icon.png         ✅ (Linux)
```

---

## 8. Comandos Rápidos

| Acción | Comando |
|--------|---------|
| Development | `npm run tauri dev` |
| Build | `npm run tauri build` |
| Solo MSI | `npm run tauri build -- --bundles msi` |
| Solo NSIS | `npm run tauri build -- --bundles nsis` |
| Verificar Rust | `cargo check` |
| Deps Rust | `cargo update` |

---

## 9. Estructura del Proyecto

```
Aether-desktop/
├── src/                    # Frontend (Astro/React/TS)
├── src-tauri/
│   ├── src/              # Backend (Rust)
│   ├── icons/            # Iconos multiplataforma
│   ├── Cargo.toml       # Dependencias Rust
│   └── tauri.conf.json # Configuración Tauri
├── package.json          # Dependencias Node
└── pnpm-lock.yaml
```

---

## 10. Notas Finales

- ✅ La aplicación usa `localStorage` - compatible con todas las plataformas
- ✅ No requiere cambios en la lógica de red para Windows
- ✅ WebView2 proporciona la misma API que un navegador moderno
- ✅ Los icons `.ico` y `.icns` ya están disponibles en el proyecto