'use client';

import { useState, useEffect, useCallback } from 'react';

export interface SetupProgress {
    currentStep: number;
    totalSteps: number;
    stepName: string;
    completed: boolean;
    errors: string[];
    lastUpdated: string;
    serverUrl?: string;
    port?: string;
}

interface StoredProgress {
    progress: SetupProgress | null;
    timestamp: string;
}

const STORAGE_KEY = 'app-setup-progress';

const DEFAULT_PROGRESS: SetupProgress = {
    currentStep: 0,
    totalSteps: 1,
    stepName: 'server-config',
    completed: false,
    errors: [],
    lastUpdated: new Date().toISOString(),
};

function generateProgressMarkdown(progress: SetupProgress): string {
    const status = progress.completed ? '✅ COMPLETADO' : '🔄 EN PROGRESO';
    const errorSection = progress.errors.length > 0 
        ? `\n## Errores Encontrados\n${progress.errors.map(e => `- ${e}`).join('\n')}`
        : '\n## Errores Encontrados\nSin errores';
    
    return `# PROGRESO - Aplicación de Configuración\n\n## Estado General\n- **Estado**: ${status}\n- **Última Actualización**: ${progress.lastUpdated}\n\n## Progreso del Setup\n- **Paso Actual**: ${progress.currentStep + 1} de ${progress.totalSteps}\n- **Nombre del Paso**: ${progress.stepName}\n\n## Datos de Configuración\n- **Servidor**: ${progress.serverUrl || 'No configurado'}\n- **Puerto**: ${progress.port || 'No configurado'}${errorSection}\n`;
}

function parseProgressMarkdown(markdown: string): SetupProgress | null {
    try {
        const lines = markdown.split('\n');
        const progress: Partial<SetupProgress> = {
            errors: [],
            lastUpdated: new Date().toISOString(),
        };

        let inErrorsSection = false;
        
        for (const line of lines) {
            if (line.includes('Paso Actual')) {
                const match = line.match(/(\d+)\s+de\s+(\d+)/);
                if (match) {
                    progress.currentStep = parseInt(match[1]) - 1;
                    progress.totalSteps = parseInt(match[2]);
                }
            }
            if (line.includes('Nombre del Paso')) {
                const match = line.match(/:\s*(.+)$/);
                if (match) {
                    progress.stepName = match[1].trim();
                }
            }
            if (line.includes('Servidor') && !line.includes('##')) {
                const match = line.match(/:\s*(.+)$/);
                if (match && match[1].trim() !== 'No configurado') {
                    progress.serverUrl = match[1].trim();
                }
            }
            if (line.includes('Puerto') && !line.includes('##')) {
                const match = line.match(/:\s*(.+)$/);
                if (match && match[1].trim() !== 'No configurado') {
                    progress.port = match[1].trim();
                }
            }
            if (line.includes('Errores Encontrados')) {
                inErrorsSection = true;
                continue;
            }
            if (inErrorsSection && line.startsWith('- ')) {
                progress.errors?.push(line.substring(2));
            }
            if (line.startsWith('#') && inErrorsSection) {
                inErrorsSection = false;
            }
            if (line.includes('COMPLETADO')) {
                progress.completed = true;
            }
        }

        return {
            currentStep: progress.currentStep ?? 0,
            totalSteps: progress.totalSteps ?? 1,
            stepName: progress.stepName ?? 'unknown',
            completed: progress.completed ?? false,
            errors: progress.errors ?? [],
            lastUpdated: progress.lastUpdated ?? new Date().toISOString(),
            serverUrl: progress.serverUrl,
            port: progress.port,
        };
    } catch {
        return null;
    }
}

export function useProgressPersistence() {
    const [progress, setProgress] = useState<SetupProgress>(DEFAULT_PROGRESS);
    const [isLoading, setIsLoading] = useState(true);
    const [isRestored, setIsRestored] = useState(false);

    useEffect(() => {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            try {
                const parsed: StoredProgress = JSON.parse(stored);
                if (parsed.progress) {
                    setProgress(parsed.progress);
                    setIsRestored(true);
                }
            } catch {
                setProgress(DEFAULT_PROGRESS);
            }
        }
        setIsLoading(false);
    }, []);

    const updateProgress = useCallback((updates: Partial<SetupProgress>) => {
        setProgress(prev => {
            const newProgress: SetupProgress = {
                ...prev,
                ...updates,
                lastUpdated: new Date().toISOString(),
            };
            
            localStorage.setItem(STORAGE_KEY, JSON.stringify({
                progress: newProgress,
                timestamp: new Date().toISOString(),
            }));
            
            return newProgress;
        });
    }, []);

    const addError = useCallback((error: string) => {
        setProgress(prev => {
            const newProgress: SetupProgress = {
                ...prev,
                errors: [...prev.errors, error],
                lastUpdated: new Date().toISOString(),
            };
            
            localStorage.setItem(STORAGE_KEY, JSON.stringify({
                progress: newProgress,
                timestamp: new Date().toISOString(),
            }));
            
            return newProgress;
        });
    }, []);

    const clearErrors = useCallback(() => {
        setProgress(prev => {
            const newProgress: SetupProgress = {
                ...prev,
                errors: [],
                lastUpdated: new Date().toISOString(),
            };
            
            localStorage.setItem(STORAGE_KEY, JSON.stringify({
                progress: newProgress,
                timestamp: new Date().toISOString(),
            }));
            
            return newProgress;
        });
    }, []);

    const markStepComplete = useCallback((stepName: string) => {
        setProgress(prev => {
            const newProgress: SetupProgress = {
                ...prev,
                stepName,
                completed: true,
                currentStep: prev.currentStep + 1,
                lastUpdated: new Date().toISOString(),
            };
            
            localStorage.setItem(STORAGE_KEY, JSON.stringify({
                progress: newProgress,
                timestamp: new Date().toISOString(),
            }));
            
            return newProgress;
        });
    }, []);

    const exportToMarkdown = useCallback(() => {
        const markdown = generateProgressMarkdown(progress);
        const blob = new Blob([markdown], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'PROGRESO-app.md';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }, [progress]);

    const importFromMarkdown = useCallback((markdown: string) => {
        const parsed = parseProgressMarkdown(markdown);
        if (parsed) {
            setProgress(parsed);
            localStorage.setItem(STORAGE_KEY, JSON.stringify({
                progress: parsed,
                timestamp: new Date().toISOString(),
            }));
            setIsRestored(true);
            return true;
        }
        return false;
    }, []);

    const resetProgress = useCallback(() => {
        setProgress(DEFAULT_PROGRESS);
        localStorage.removeItem(STORAGE_KEY);
    }, []);

    return {
        progress,
        isLoading,
        isRestored,
        updateProgress,
        addError,
        clearErrors,
        markStepComplete,
        exportToMarkdown,
        importFromMarkdown,
        resetProgress,
    };
}