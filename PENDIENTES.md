# Pendientes - Aether Panel

## Estado: En Desarrollo

Fecha de actualizacion: Abril 2026

---

## Builds Generados

| Paquete | Ubicacion | Estado |
|---------|-----------|--------|
| .deb | `src-tauri/target/release/bundle/deb/AetherPanel_0.1.0_amd64.deb` | Listo |
| .rpm | `src-tauri/target/release/bundle/rpm/AetherPanel-0.1.0-1.x86_64.rpm` | Listo |
| .AppImage | `src-tauri/target/release/bundle/appimage/` | Error (linuxdeploy) |

---

## Pendientes de Desarrollo

### Alta Prioridad

1. **Build Android (.apk)**
   - Estado: Pendiente (SDK no instalado)
   - Requiere: Android SDK + Rust targets
   - Comando necesario:
     ```bash
     rustup target add aarch64-linux-android armv7-linux-androideabi
     npm run tauri:build
     ```

2. **Verificar conexion de API**
   - Estado: Necesita testeo
   - El setup usa `localhost:8080` como default

### Prioridad Media

3. **WebSocket para consola**
   - Estado: Implementado pero necesita testeo con backend real
   - Archivo: `src/features/servers/[id]/page.tsx`

4. **File Manager**
   - Estado: Implementado pero necesita testeo
   - Archivos: `file-manager-view.tsx`

5. **Backups**
   - Estado: Implementado pero necesita testeo
   - Archivo: `backups-view.tsx`

### Baja Prioridad

6. **Build Windows**
   - Estado: No testing
   - Requiere: Windows con WebView2

7. **Build macOS**
   - Estado: No testing
   - Requiere: macOS con Xcode

8. **Iconos de la app**
   - Verificar que se usan los iconos correctos en el build

---

## Pendientes de Documentacion

9. **Actualizar README.md** con comandos de build finales

10. **Crear guia de instalacion** para usuarios finales

11. **Documentar configuracion de backend** necesario

---

## Pendientes de Testing

### Prueba de funcionalidad

- [ ] Login con credenciales reales
- [ ] Conexion a API de backend
- [ ] Ver Servers list
- [ ] Console WebSocket
- [ ] File Manager upload/download
- [ ] Create/Restore backups
- [ ] Cambiar servidor (Setup page)

---

## Notas

- Para ejecutar en Linux con problemas de Wayland:
  ```bash
  GDK_BACKEND=x11 ./src-tauri/target/release/app
  ```

- Para desarrollo:
  ```bash
  source ~/.cargo/env && GDK_BACKEND=x11 npm run tauri:dev
  ```