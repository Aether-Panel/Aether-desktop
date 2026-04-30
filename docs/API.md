# API Reference - Aether Panel

## Indice

1. [Resumen](#resumen)
2. [Configuracion](#configuracion)
3. [Autenticacion](#autenticacion)
4. [Servidores](#servidores)
5. [Nodos](#nodos)
6. [Archivos](#archivos)
7. [Consola](#consola)
8. [Backups](#backups)
9. [Base de Datos](#base-de-datos)
10. [Usuarios](#usuarios)
11. [Plantillas](#plantillas)
12. [Configuracion Global](#configuracion-global)

---

## 1. Resumen

La API de Aether Panel es RESTful y usa JSON para las respuestas. Todas las peticiones requieren autenticacion excepto las de autenticacion.

### Base URL

```
http://{servidor}:{puerto}/api/
```

### Headers

```http
Content-Type: application/json
Accept: application/json
Cookie: puffer_auth={token}  (para autenticacion basada en cookies)
```

---

## 2. Configuracion

### GET /api/config

Obtiene la configuracion global del sistema.

**Respuesta:**
```json
{
  "themes": {
    "active": "dark",
    "settings": "default-dark",
    "available": ["dark", "light", "system"]
  },
  "branding": {
    "name": "Aether Panel"
  },
  "registrationEnabled": true
}
```

---

## 3. Autenticacion

### POST /auth/login

Iniciar sesion.

**Request:**
```json
{
  "email": "admin@example.com",
  "password": "password123"
}
```

**Respuesta:**
```json
{
  "id": 1,
  "username": "admin",
  "email": "admin@example.com",
  "otpNeeded": false,
  "scopes": ["login", "admin"]
}
```

### POST /auth/register

Registrar nuevo usuario.

**Request:**
```json
{
  "username": "newuser",
  "email": "newuser@example.com",
  "password": "password123"
}
```

### POST /auth/logout

Cerrar sesion.

### GET /api/self

Obtener informacion del usuario actual.

**Respuesta:**
```json
{
  "id": 1,
  "username": "admin",
  "email": "admin@example.com",
  "scopes": ["login", "admin"]
}
```

---

## 4. Servidores

### GET /api/servers

Lista de todos los servidores.

**Respuesta:**
```json
[
  {
    "id": "srv-1",
    "name": "Minecraft Server",
    "node": "node-1",
    "status": "online",
    "port": 25565,
    "internalId": 1
  }
]
```

### GET /api/servers/:id

Detalles de un servidor especifico.

### GET /api/servers/:id/stats

Estadisticas en tiempo real del servidor.

**Respuesta:**
```json
{
  "cpu": 45.2,
  "memory": 2048,
  "memoryMax": 4096,
  "uptime": 3600,
  "players": 12,
  "maxPlayers": 100
}
```

### POST /api/servers/:id/start

Iniciar el servidor.

### POST /api/servers/:id/stop

Detener el servidor.

### POST /api/servers/:id/restart

Reiniciar el servidor.

---

## 5. Nodos

### GET /api/nodes

Lista de nodos disponibles.

**Respuesta:**
```json
[
  {
    "id": "node-1",
    "name": "Main Node",
    "status": "online",
    "cpuAllocated": 50,
    "memoryAllocated": 8192
  }
]
```

### GET /api/nodes/:id

Detalles de un nodo.

### GET /api/nodes/:id/system

Informacion del sistema del nodo.

---

## 6. Archivos

### GET /api/servers/:id/file/:path

Listar archivos en un directorio.

**Respuesta:**
```json
{
  "files": [
    {
      "name": "server.properties",
      "isFile": true,
      "size": 1024,
      "modified": "2024-01-01T00:00:00Z"
    }
  ]
}
```

### GET /api/servers/:id/file/:path?folder

Crear directorio.

### PUT /api/servers/:id/file/:path

Subir/crear archivo.

**Request:**
```http
Content-Type: multipart/form-data
Body: contenido del archivo
```

### DELETE /api/servers/:id/file/:path

Eliminar archivo o directorio.

---

## 7. Consola

### WebSocket /api/servers/:id/socket?console

Conexion WebSocket para la consola en tiempo real.

**Mensajes del servidor:**
```json
{
  "type": "console",
  "data": {
    "logs": ["[INFO] Server started"]
  }
}
```

### POST /api/servers/:id/console

Enviar comando a la consola.

**Request:**
```text
say Hello World
```

---

## 8. Backups

### GET /api/servers/:id/backup

Listar backups del servidor.

### POST /api/servers/:id/backup/create

Crear nuevo backup.

**Request:**
```json
{
  "name": "backup-01"
}
```

### POST /api/servers/:id/backup/restore/:id

Restaurar backup.

### DELETE /api/servers/:id/backup/:id

Eliminar backup.

### GET /api/servers/:id/backup/download/:id

Descargar backup.

---

## 9. Base de Datos

### GET /api/databasehosts

Lista de hosts de base de datos.

### POST /api/databasehosts

Crear nuevo host de base de datos.

**Request:**
```json
{
  "name": "MySQL",
  "host": "localhost",
  "port": 3306,
  "username": "root",
  "password": "password"
}
```

### PUT /api/databasehosts/:id

Actualizar host de base de datos.

### DELETE /api/databasehosts/:id

Eliminar host de base de datos.

---

## 10. Usuarios

### GET /api/users

Lista de usuarios.

### POST /api/users

Crear nuevo usuario.

### PUT /api/users/:id

Actualizar usuario.

### DELETE /api/users/:id

Eliminar usuario.

---

## 11. Plantillas

### GET /api/templates

Lista de plantillas disponibles.

### GET /api/templates/:repoId/:templateName

Obtener detalles de una plantilla.

### PUT /api/templates/0/:templateName

Actualizar configuracion de plantilla.

---

## 12. Configuracion Global

### GET /api/settings

Obtener configuracion global.

### POST /api/settings

Actualizar configuracion global.

**Request:**
```json
{
  "branding": {
    "name": "My Panel"
  },
  "registrationEnabled": true
}
```

### POST /api/settings/test/email

Probar configuracion de email.

### POST /api/settings/test/discord

Probar integracion con Discord.

---

## Codigos de Error

| Codigo | Descripcion |
|--------|-------------|
| 400 | Solicitud incorrecta |
| 401 | No autenticado |
| 403 | Permisos insuficientes |
| 404 | Recurso no encontrado |
| 409 | Conflicto de recursos |
| 500 | Error interno del servidor |