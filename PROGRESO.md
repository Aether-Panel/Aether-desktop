# PROGRESO - Configuración de Servidor + Integración API

## Resumen de lo Implementado

Se ha implementado una página de "Configuración de Servidor" que actúa como pantalla inicial antes del Login, y se ha integrado con el cliente de API.

### Componentes Creados

1. **Hook de Persistencia** (`src/hooks/use-server-config.ts`)
   - `useServerConfig`: Hook personalizado que maneja la lectura/escritura de configuración en localStorage
   - Interfaz `ServerConfig`: Define la estructura `{ serverUrl: string, port: string }`
   - Clave de storage: `app-server-config`

2. **Componente React** (`src/features/setup/page.tsx`)
   - Formulario con validación usando Zod + React Hook Form
   - Campo "Domain or IP" con validación de formato (IP o dominio)
   - Campo "Port" con validación de rango (1-65535)
   - Redirección automática a `/login` tras guardar

3. **Página Astro** (`src/pages/setup.astro`)
   - Renderiza el componente React con `client:only="react"`
   - Wrapper en `PageWrappers.tsx` exportando la función `Setup`

4. **Modificación del Index** (`src/pages/index.astro`)
   - Redirecciona `/` → `/setup/` como punto de entrada

## Estado de la Configuración de Red

| Campo | Tipo | Validación |
|-------|------|-------------|
| serverUrl | string | IP válida o dominio |
| port | string | Número 1-65535 |

**Persistencia**: localStorage (clave: `app-server-config`)

---

## Integración con API (Esta Sesión)

### Archivos Modificados/Creados

| Archivo | Acción | Descripción |
|---------|--------|-------------|
| `src/lib/server-config.ts` | **Creado** | Utilidades para leer config del servidor |
| `src/lib/api-client.ts` | **Modificado** | Ahora usa BaseURL dinámica |
| `src/contexts/providers.tsx` | **Modificado** | Verifica config antes de cargar |

### Método de Inyección de URL

**Modelo**: Interceptor de funciones API + helper functions

```typescript
// src/lib/server-config.ts
export function getBaseUrl(): string {
    const config = getServerConfig();
    const protocol = config.port === '443' ? 'https' : 'http';
    return `${protocol}://${config.serverUrl}:${config.port}`;
}

export function buildApiUrl(endpoint: string): string {
    return `${baseUrl}${endpoint}`;
}
```

```typescript
// src/lib/api-client.ts
function ensureConfigured(): void {
    if (!isServerConfigured()) {
        window.location.href = '/setup/';
    }
}

export const api = {
    async get(url: string) {
        ensureConfigured();
        const fullUrl = buildApiUrl(url);
        // ... fetch
    }
    // post, put, delete también usan buildApiUrl
};
```

### Estado de la Conexión

- [x] **Endpoints configurables**: Todos los hooks que usan `api.get/post/put/delete` ahora reciben URLs relativas (`/api/...`) que se convierten a URLs completas
- [x] **Protección de ruta**: Si no hay config guardada, cualquier request redirige a `/setup/`
- [x] **Verificación en Providers**: AuthProvider verifica si hay config antes de cargar la app

### Flujo Completo

```
1. Usuario entra a /
2. Redirige a /setup/
3. Usuario ingresa serverUrl + port → Guardado en localStorage
4. Redirige a /login/
5. AuthProvider verifica isServerConfigured() → true
6. Login successful → api.post('/auth/login') → buildApiUrl('/auth/login')
7. API request: POST http://serverUrl:port/auth/login
```

---

## Próximos Pasos

1. **Validar la conexión**:
   - Levantar un backend real en la IP:puerto configurada
   - Probar login con credenciales reales

2. **Testing opcional**:
   - Proteger endpoints con error handling si el servidor no responde
   - Mostrar indicador de "conectando..." durante requests

3. **Mejoras opcionales**:
   - Agregar botón para cambiar servidor en Settings
   - Validar conectividad antes de permitir login