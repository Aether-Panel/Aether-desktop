'use client';

import * as React from 'react';

export function useSound() {
    const audioContextRef = React.useRef<AudioContext | null>(null);
    const audioRef = React.useRef<HTMLAudioElement | null>(null);
    const loadedSoundRef = React.useRef<Map<string, HTMLAudioElement>>(new Map());

    const loadSound = React.useCallback((src: string): HTMLAudioElement | null => {
        if (typeof window === 'undefined') return null;

        if (loadedSoundRef.current.has(src)) {
            return loadedSoundRef.current.get(src) || null;
        }

        const audio = new Audio(src);
        audio.preload = 'auto';
        loadedSoundRef.current.set(src, audio);
        return audio;
    }, []);

    const playSound = React.useCallback((src: string) => {
        if (typeof window === 'undefined') return;

        const audio = loadSound(src);
        if (audio) {
            audio.currentTime = 0;
            audio.play().catch(console.error);
        }
    }, [loadSound]);

    const playClick = React.useCallback(() => {
        if (typeof window === 'undefined') return;
        
        if (!audioContextRef.current) {
            audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        }
        
        const ctx = audioContextRef.current;
        const now = ctx.currentTime;
        
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);
        
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(800, now);
        oscillator.frequency.exponentialRampToValueAtTime(1200, now + 0.1);
        
        gainNode.gain.setValueAtTime(0.3, now);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
        
        oscillator.start(now);
        oscillator.stop(now + 0.15);
    }, []);

    const playSuccess = React.useCallback(() => {
        if (typeof window === 'undefined') return;
        
        if (!audioContextRef.current) {
            audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        }
        
        const ctx = audioContextRef.current;
        const now = ctx.currentTime;
        
        const frequencies = [523.25, 659.25, 783.99];
        
        frequencies.forEach((freq, i) => {
            const oscillator = ctx.createOscillator();
            const gainNode = ctx.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(ctx.destination);
            
            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(freq, now + i * 0.08);
            
            const startTime = now + i * 0.08;
            gainNode.gain.setValueAtTime(0, startTime);
            gainNode.gain.linearRampToValueAtTime(0.2, startTime + 0.02);
            gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.2);
            
            oscillator.start(startTime);
            oscillator.stop(startTime + 0.25);
        });
    }, []);

    const playPop = React.useCallback(() => {
        if (typeof window === 'undefined') return;
        
        if (!audioContextRef.current) {
            audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        }
        
        const ctx = audioContextRef.current;
        const now = ctx.currentTime;
        
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);
        
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(600, now);
        oscillator.frequency.exponentialRampToValueAtTime(100, now + 0.1);
        
        gainNode.gain.setValueAtTime(0.25, now);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
        
        oscillator.start(now);
        oscillator.stop(now + 0.1);
    }, []);

    return {
        playSound,
        playClick,
        playSuccess,
        playPop,
    };
}