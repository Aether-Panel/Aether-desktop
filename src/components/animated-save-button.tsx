'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Check } from 'lucide-react';
import * as React from 'react';

interface AnimatedSaveButtonProps {
    onClick: () => Promise<void>;
    disabled?: boolean;
    className?: string;
    onComplete?: () => void;
}

type ButtonState = 'idle' | 'loading' | 'success';

const PARTICLES = Array.from({ length: 12 });

export function AnimatedSaveButtonWrapper({ 
    onSave, 
    disabled,
    className,
    onComplete,
}: { 
    onSave: () => Promise<void>; 
    disabled?: boolean;
    className?: string;
    onComplete?: () => void;
}) {
    const [buttonState, setButtonState] = React.useState<'idle' | 'loading' | 'success'>('idle');
    const [showParticles, setShowParticles] = React.useState(false);

    const handleClick = async () => {
        if (buttonState !== 'idle' || disabled) return;
        
        setShowParticles(true);
        
        setTimeout(() => {
            setButtonState('loading');
            setShowParticles(false);
        }, 400);

        try {
            await onSave();
            setButtonState('success');
            
            setTimeout(() => {
                setButtonState('idle');
                onComplete?.();
            }, 1400);
        } catch {
            setButtonState('idle');
        }
    };

    const isDisabled = disabled || buttonState !== 'idle';

    return (
        <div className="relative flex justify-center">
            <div className="relative">
                <AnimatePresence>
                    {showParticles && (
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            {PARTICLES.map((_, i) => (
                                <motion.div
                                    key={i}
                                    className="absolute w-2 h-2 rounded-full bg-primary"
                                    initial={{ 
                                        scale: 0, 
                                        opacity: 1,
                                        x: 0,
                                        y: 0,
                                    }}
                                    animate={{
                                        scale: [0, 1.5, 0],
                                        opacity: [1, 0.8, 0],
                                        x: Math.cos((i * 30) * Math.PI / 180) * 40,
                                        y: Math.sin((i * 30) * Math.PI / 180) * 40,
                                    }}
                                    transition={{
                                        duration: 0.5,
                                        ease: 'easeOut',
                                    }}
                                    style={{
                                        rotate: `${i * 30}deg`,
                                    }}
                                />
                            ))}
                            <motion.div
                                className="absolute w-16 h-16 rounded-full border-2 border-primary/50"
                                initial={{ scale: 0, opacity: 1 }}
                                animate={{ scale: 2, opacity: 0 }}
                                transition={{ duration: 0.4, ease: 'easeOut' }}
                            />
                            <motion.div
                                className="absolute w-24 h-24 rounded-full border border-primary/30"
                                initial={{ scale: 0, opacity: 1 }}
                                animate={{ scale: 2.5, opacity: 0 }}
                                transition={{ duration: 0.5, ease: 'easeOut' }}
                            />
                        </div>
                    )}
                </AnimatePresence>

                <motion.button
                    type="submit"
                    className={`relative h-10 px-8 rounded-lg font-medium text-sm transition-colors
                        bg-primary text-primary-foreground hover:bg-primary/90 
                        disabled:opacity-50 disabled:cursor-not-allowed
                        shadow-md overflow-visible
                        ${className || ''}`}
                    disabled={isDisabled}
                    onClick={handleClick}
                    whileHover={{ scale: isDisabled ? 1 : 1.02 }}
                    whileTap={!isDisabled ? { scale: 0.95 } : {}}
                    animate={
                        showParticles 
                            ? { 
                                scale: [1, 0.92, 1.05, 1],
                                boxShadow: [
                                    '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                                    '0 0 20px 5px rgba(59, 130, 246, 0.5)',
                                    '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                                ]
                            } 
                            : {}
                    }
                    transition={{
                        scale: { type: 'spring', stiffness: 400, damping: 15 },
                        boxShadow: { duration: 0.3 }
                    }}
                >
                    <AnimatePresence mode="wait">
                        {buttonState === 'idle' && (
                            <motion.span
                                key="idle"
                                initial={{ opacity: 0, y: 5 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -5 }}
                                transition={{ duration: 0.15 }}
                            >
                                Guardar
                            </motion.span>
                        )}
                        
                        {buttonState === 'loading' && (
                            <motion.div
                                key="loading"
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                transition={{ duration: 0.15 }}
                                className="flex items-center justify-center gap-2"
                            >
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                                >
                                    <Loader2 className="h-4 w-4" />
                                </motion.div>
                                <span>Guardando...</span>
                            </motion.div>
                        )}
                        
                        {buttonState === 'success' && (
                            <motion.div
                                key="success"
                                initial={{ opacity: 0, scale: 0.5 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.5 }}
                                transition={{ duration: 0.2 }}
                                className="flex items-center justify-center gap-2"
                            >
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ 
                                        type: 'spring', 
                                        stiffness: 500, 
                                        damping: 20,
                                        delay: 0.1 
                                    }}
                                >
                                    <Check className="h-4 w-4" />
                                </motion.div>
                                <span>Guardado!</span>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {buttonState === 'success' && (
                        <motion.div
                            className="absolute inset-0 rounded-lg bg-green-500/20"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: [0, 0.5, 0] }}
                            transition={{ duration: 0.6 }}
                        />
                    )}
                </motion.button>
            </div>
        </div>
    );
}

export function AnimatedSaveButton({ onClick, disabled, className, onComplete }: AnimatedSaveButtonProps) {
    return <AnimatedSaveButtonWrapper onSave={onClick} disabled={disabled} className={className} onComplete={onComplete} />;
}