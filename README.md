# Aether Panel - Documentacion Completa

## Indice General

1. [Descripcion del Proyecto](#descripcion-del-proyecto)
2. [Tecnologias Utilizadas](#tecnologias-utilizadas)
3. [Arquitectura del Sistema](#arquitectura-del-sistema)
4. [Requisitos del Sistema](#requisitos-del-sistema)
5. [Instalacion y Configuracion](#instalacion-y-configuracion)
6. [Desarrollo](#desarrollo)
7. [Build y Compilacion](#build-y-compilacion)
8. [Estructura de Archivos](#estructura-de-archivos)
9. [Configuracion de API](#configuracion-de-api)
10. [Errores Comunes](#errores-comunes)
11. [Documentacion Adicional](#documentacion-adicional)
12. [Contribucion](#contribucion)
13. [Licencia](#licencia)

---

## 1. Descripcion del Proyecto

**Aether Panel** es una aplicacion de gestion de servidores de juego y servicios web. Proporciona una interfaz grafica moderna para administrar nodos, servidores, bases de datos y usuarios.

### Caracteristicas Principales

- Gestion de servidores de juego (Minecraft, Rust, etc.)
- Gestion de nodos y recursos
- Base de datos de plantillas
- Sistema de usuarios y roles
- Consola en tiempo real con WebSocket
- Gestor de archivos integrado
- Sistema de backups
- Transferencia externa de archivos

### Plataformas Soportadas

| Plataforma | Estado | Paquete |
|------------|--------|---------|
| Linux (Desktop) | Estable | .deb, .AppImage |
| Linux (Fedora/RHEL) | Estable | .rpm |
| Windows (Desktop) | En desarrollo | .exe, .msi |
| Android (Mobile) | Configurado | .apk |
| macOS (Desktop) | En desarrollo | .dmg |

---

## 2. Tecnologias Utilizadas

### Frontend (Interface de Usuario)

| Tecnologia | Version | Uso |
|------------|---------|-----|
| **Astro** | 5.17.x | Framework web principal |
| **React** | 18.3.x | Componentes interactivos |
| **TypeScript** | 5.x | Tipado estatico |
| **Tailwind CSS** | 3.4.x | Estilos y diseño |
| **Radix UI** | 1.x | Componentes UI accesibles |
| **Lucide React** | 0.475.x | Iconos |
| **Zod** | 3.24.x | Validacion de esquemas |
| **React Hook Form** | 7.54.x | Formularios |
| **Recharts** | 2.15.x | Graficos y statistiques |
| **Monaco Editor** | 4.6.x | Editor de codigo |

### Backend (Escritorio)

| Tecnologia | Version | Uso |
|------------|---------|-----|
| **Tauri** | 2.10.x | Framework de escritorio |
| **Rust** | 1.95.x | Lenguaje del backend |
| **WebKit2GTK** | 2.0.x | Motor de renderizado web |
| **GTK3** | 3.24.x | Biblioteca grafica |

### Herramientas de Desarrollo

| Tecnologia | Uso |
|------------|-----|
| **Vite** | Bundler y dev server |
| **ESLint** | Linting de codigo |
| **TypeScript** | Verificacion de tipos |
| **Cargo** | Gestor de paquetes Rust |

---

## 3. Arquitectura del Sistema

### Diagrama de Arquitectura

```
┌──────────────────────────────────────────────────────────────┐
│                     Aether Panel App                         │
├──────────────────────────────────────────────────────────────┤
│  Frontend (Astro + React)                                    │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐           │
│  │ Setup Page  │  │  Login Page │  │ Dashboard   │           │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘           │
│         │                │                │                  │
│         └────────────────┼────────────────┘                  │
│                          ▼                                   │
│              ┌─────────────────────┐                         │
│              │  Server Config      │                         │
│              │  (localStorage)     │                         │
│              └─────────┬───────────┘                         │
│                        │                                     │
│                        ▼                                     │
│            ┌─────────────────────┐                           │
│            │     API Client      │                           │
│            │    (buildApiUrl)    │                           │
│            └───────────┬─────────┘                           │
└────────────────────────┼─────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                   Backend Externo                           │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐          │
│  │   REST API  │  │   WebSocket │  │   Web UI    │          │
│  │  :8080      │  │   :8080     │  │   :8080     │          │
│  └─────────────┘  └─────────────┘  └─────────────┘          │
└─────────────────────────────────────────────────────────────┘
```

(PufferPanel u otro backend compatible, ya que todo es un fork de PufferPanel, pero de igualmenera si hay otro fork de la raiz madre o incluso de Aether Panel u otro panel de control, se puede adaptar)

### Flujo de Datos

1. **Configuracion Inicial**
   - Usuario visita `/setup/`
   - Ingresa IP del servidor y puerto
   - Se guarda en localStorage

2. **Autenticacion**
   - Usuario visita `/login/`
   - Envía credenciales a la API
   - Backend retorna token/sesion

3. **Operaciones**
   - Todas las peticiones API usan BaseURL dinamica
   - WebSocket para consola en tiempo real

---

## 4. Requisitos del Sistema

### Linux (Desktop)

| Requisito | Version minima |
|----------|----------------|
| GLIBC | 2.31+ |
| GTK3 | 3.22+ |
| WebKit2GTK | 4.1+ |
| Memoria RAM | 4 GB |
| Espacio | 500 MB |

### Android (Mobile)

| Requisito | Version minima |
|----------|----------------|
| Android | 7.0 (API 24) |
| WebView | Chrome 60+ |
| Memoria RAM | 2 GB |

### Windows (Desktop)

| Requisito | Version minima |
|----------|----------------|
| Windows | 10+ |
| WebView2 | Evergreen |
| Memoria RAM | 4 GB |

### macOS (Desktop)

| Requisito | Version minima |
|----------|----------------|
| macOS | 10.15+ |
| Memoria RAM | 4 GB |

---

## 5. Instalacion y Configuracion

### 5.1 Requisitos Previos

#### Fedora/RHEL/CentOS

```bash
# Instalar dependencias del sistema
sudo dnf install gtk3-devel cairo-devel pango-devel gdk-pixbuf2-devel \
    atk-devel libjpeg-turbo-devel libtiff-devel webkit2gtk4.1-devel \
    libsoup3-devel libxml2-devel

# Instalar Node.js
curl -fsSL https://fnm.vercel.app/install | bash
source ~/.bashrc
fnm install --lts

# Instalar Rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source ~/.cargo/env
```

#### Ubuntu/Debian

```bash
# Instalar dependencias del sistema
sudo apt install libgtk-3-dev libcairo2-dev libpango1.0-dev \
    libgdk-pixbuf-2.0-dev libatk1.0-dev libjpeg-dev \
    libtiff-dev libsoup2.4-dev libxml2-dev libwebkit2gtk-4.1-dev

# Instalar Node.js
curl -fsSL https://fnm.vercel.app/install | bash
source ~/.bashrc
fnm install --lts

# Instalar Rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source ~/.cargo/env
```

### 5.2 Clonar y Instalar

```bash
# Clonar repositorio
git clone https://github.com/tu-usuario/aether-panel.git
cd aether-panel

# Instalar dependencias
npm install
```

### 5.3 Desarrollo Web

```bash
# Iniciar servidor de desarrollo
npm run dev

# Abrir en navegador
# http://localhost:9002/
```

### 5.4 Desarrollo Tauri

```bash
# Iniciar aplicacion de escritorio
npm run tauri:dev
```

---

## 6. Desarrollo

### Comandos Disponibles

| Comando | Descripcion |
|--------|-------------|
| `npm run dev` | Iniciar servidor dev (Astro) |
| `npm run build` | Build produccion (Astro) |
| `npm run start` | Preview del build |
| `npm run typecheck` | Verificar tipos TypeScript |
| `npm run lint` | Linting de codigo |
| `npm run tauri:dev` | Desarrollo Tauri |
| `npm run tauri:build` | Build produccion Tauri |

### Estructura de Componentes

```
src/
├── components/          # Componentes UI reutilizables
│   └── ui/            # Componentes Radix UI
├── contexts/           # React Context (Auth, Config, i18n)
├── features/          # Páginas y features
│   ├── auth/         # Login, Register
│   ├── setup/        # Configuración de servidor
│   ├── servers/      # Gestión de servidores
│   ├── nodes/        # Gestión de nodos
│   └── ...
├── hooks/             # Custom hooks
├── lib/               # Utilidades
│   ├── api-client.ts  # Cliente HTTP
│   ├── server-config.ts  # Configuración
│   └── ...
├── pages/             # Rutas Astro
└── styles/            # Estilos globales
```

---

## 7. Build y Compilacion

### 7.1 Linux (.deb)

```bash
npm run tauri:build

# Output
# src-tauri/target/release/bundle/deb/AetherPanel_0.1.0_amd64.deb
```

### 7.2 Linux (.rpm)

```bash
cd src-tauri/target/release/bundle/deb
sudo alien -r --to-rpm AetherPanel_0.1.0_amd64.deb
sudo rpm -i --nodeps aether-panel-0.1.0-2.x86_64.rpm
```

### 7.3 Linux (.AppImage)

```bash
npm run tauri:build

# Output
# src-tauri/target/release/bundle/appimage/AetherPanel_0.1.0.AppImage
```

### 7.4 Android (.apk)

```bash
# Instalar Android SDK primero (ver seccion 5.1)
source ~/.cargo/env
rustup target add aarch64-linux-android armv7-linux-androideabi

npm run tauri:build

# Output
# src-tauri/target/release/bundle/android/*.apk
```

### 7.5 Ejecucion Directa (Linux)

```bash
# Si hay errores de Wayland
GDK_BACKEND=x11 ./src-tauri/target/release/app
```

---

## 8. Estructura de Archivos

```
aether-panel/
├── .astro/                 # Cache de Astro
├── .vscode/                # Configuracion VSCode
├── public/                 # Archivos estaticos
│   ├── js/               # Scripts (Ace editor)
│   ├── fonts/            # Fuentes
│   ├── favicon.ico       # Favicon
│   └── sw.js             # Service Worker
├── src/                   # Codigo fuente
│   ├── components/       # Componentes React
│   ├── contexts/        # Contextos React
│   ├── features/        # Features/paginas
│   ├── hooks/           # Hooks personalizados
│   ├── layouts/        # Layouts Astro
│   ├── lib/             # Utilidades
│   └── pages/           # Rutas
├── src-tauri/            # Aplicacion Tauri
│   ├── src/             # Codigo Rust
│   ├── capabilities/    # Permisos
│   ├── icons/           # Iconos
│   ├── Cargo.toml       # Dependencias Rust
│   └── tauri.conf.json  # Config Tauri
├── dist/                 # Build output
├── package.json         # Dependencias npm
├── astro.config.mjs    # Config Astro
├── tailwind.config.mjs # Config Tailwind
├── tsconfig.json       # Config TypeScript
├── .gitignore          # Ignorados
├── README.md           # Documentacion
└── PROGRESO-app.md     # Progreso desarrollo
```

---

## 9. Configuracion de API

### Configuracion del Servidor

La aplicacion permite configurar dinamicamente la direccion del backend:

1. Visitar `/setup/`
2. Ingresar dominio/IP y puerto
3. Guardar
4. Redirige a `/login/`

### Endpoints Consumidos

| Metodo | Endpoint | Descripcion |
|-------|----------|-------------|
| GET | `/api/config` | Configuracion del sistema |
| POST | `/auth/login` | Autenticacion |
| POST | `/auth/register` | Registro |
| GET | `/api/servers` | Lista de servidores |
| GET | `/api/servers/:id` | Detalles servidor |
| GET | `/api/servers/:id/stats` | estadisticas |
| GET | `/api/servers/:id/file/:path` | Gestor de archivos |
| WS | `/api/servers/:id/socket?console` | Consola |
| POST | `/api/servers/:id/console` | Enviar comando |
| GET | `/api/nodes` | Lista de nodos |
| GET | `/api/backup` | Backups |
| GET | `/api/users` | Usuarios |

### Cambiar Servidor

Desde la pagina de login, hacer clic en "Change Server" (esquina superior derecha).

---

## 10. Errores Comunes

### Error: Puerto 3000 por defecto

**Solucion**: Cambiar a 8080 en `src/features/setup/page.tsx`

### Error: Fetch a localhost:9002

**Solucion**: Verificar que `buildApiUrl()` se usa en todos los fetch

### Error: WebSocket a puerto incorrecto

**Solucion**: Usar `buildWsUrl()` del modulo `server-config.ts`

### Error: Wayland display

**Solucion**: Ejecutar con `GDK_BACKEND=x11 ./app`

### Error: Permisos capabilities

**Solucion**: Usar solo permisos validos en `capabilities/default.json`

### Error: Librerias GTK no encontradas

**Solucion**: Instalar `gtk3-devel` y demas dependencias

### Error: Conflicto RPM /usr/bin

**Solucion**: Usar `rpm -i --nodeps` o ejecutar binario directamente

---

## 11. Documentacion Adicional

Para documentacion mas detallada, ver los archivos en la carpeta `docs/`:

| Archivo | Descripcion |
|--------|-------------|
| [docs/API.md](docs/API.md) | Referencia completa de la API REST |
| [docs/TAURI.md](docs/TAURI.md) | Configuracion de Tauri y builds |
| [PROGRESO-app.md](PROGRESO-app.md) | Registro de progreso de desarrollo |

---

## 12. Contribucion

### Guia de Contribución

1. Fork del repositorio
2. Crear rama feature: `git checkout -b feature/nombre`
3. Realizar cambios
4. Verificar con `npm run typecheck`
5. Commit: `git commit -m 'Add feature'`
6. Push: `git push origin feature/nombre`
7. Crear Pull Request

### Estándares de Codigo

- TypeScript estricto
- ESLint con reglas de Airbnb
- Prettier para format
- Commits en ingles

---

## 12. Licencia

MIT License - ver archivo LICENSE para detalles.

---

## Contacto y Soporte

- GitHub Issues: Reportar bugs
- GitHub Discussions: Preguntas
- Documentacion Adicional: Ver archivos en `/docs/`

---

*Documentacion actualizada: Abril 2026*
*Version: 0.1.0*