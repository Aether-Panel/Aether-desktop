export interface ServerConfig {
    serverUrl: string;
    port: string;
}

const STORAGE_KEY = 'app-server-config';

export function getServerConfig(): ServerConfig | null {
    if (typeof window === 'undefined') return null;
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;
    try {
        return JSON.parse(stored) as ServerConfig;
    } catch {
        return null;
    }
}

export function isServerConfigured(): boolean {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem(STORAGE_KEY) !== null;
}

export function clearServerConfig(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(STORAGE_KEY);
}

export function getBaseUrl(): string {
    const config = getServerConfig();
    if (!config) return '';
    const protocol = config.port === '443' ? 'https' : 'http';
    return `${protocol}://${config.serverUrl}:${config.port}`;
}

export function buildApiUrl(endpoint: string): string {
    const config = getServerConfig();
    if (!config) {
        const err = 'Server not configured. Redirecting to setup...';
        console.error('[buildApiUrl]', err);
        if (typeof window !== 'undefined') {
            alert('[buildApiUrl] ERROR: ' + err);
        }
        throw new Error(err);
    }
    const protocol = config.port === '443' ? 'https' : 'http';
    const baseUrl = `${protocol}://${config.serverUrl}:${config.port}`;
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    const fullUrl = `${baseUrl}${cleanEndpoint}`;
    console.log('[buildApiUrl]', { config, endpoint, fullUrl });
    return fullUrl;
}

export function buildWsUrl(endpoint: string): string {
    const config = getServerConfig();
    if (!config) {
        throw new Error('Server not configured. Redirecting to setup...');
    }
    const protocol = config.port === '443' ? 'wss' : 'ws';
    return `${protocol}://${config.serverUrl}:${config.port}${endpoint}`;
}