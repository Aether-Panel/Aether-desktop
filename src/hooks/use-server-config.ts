'use client';

import { useState, useEffect, useCallback } from 'react';

export interface ServerConfig {
    serverUrl: string;
    port: string;
}

const STORAGE_KEY = 'app-server-config';

function getStoredConfig(): ServerConfig | null {
    if (typeof window === 'undefined') return null;
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;
    try {
        return JSON.parse(stored) as ServerConfig;
    } catch {
        return null;
    }
}

export function useServerConfig() {
    const [config, setConfig] = useState<ServerConfig | null>(null);
    const [isConfigured, setIsConfigured] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const stored = getStoredConfig();
        if (stored) {
            setConfig(stored);
            setIsConfigured(true);
        }
        setLoading(false);
    }, []);

    const saveConfig = useCallback((newConfig: ServerConfig) => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newConfig));
        setConfig(newConfig);
        setIsConfigured(true);
    }, []);

    const clearConfig = useCallback(() => {
        localStorage.removeItem(STORAGE_KEY);
        setConfig(null);
        setIsConfigured(false);
    }, []);

    return {
        config,
        isConfigured,
        loading,
        saveConfig,
        clearConfig,
    };
}