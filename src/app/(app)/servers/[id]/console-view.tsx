'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send } from 'lucide-react';
import { useState } from 'react';
import AISummary from './ai-summary';
import { useTranslations } from '@/contexts/translations-context';

type LogEntry = {
  time: string;
  message: string;
};

export default function ConsoleView({ logs, addLog }: { logs: LogEntry[], addLog: (message: string) => void }) {
  const [command, setCommand] = useState('');
  const { t } = useTranslations();

  const handleSendCommand = () => {
    if (command.trim() === '') return;
    addLog(`$ ${command}`);
    addLog(`> Executing: ${command}... (not actually executed)`);
    setCommand('');
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSendCommand();
    }
  };

  const getLogColor = (logMessage: string) => {
    const upperMessage = logMessage.toUpperCase();
    if (upperMessage.includes('[ERROR]')) return 'text-red-500';
    if (upperMessage.includes('[WARN]')) return 'text-yellow-400';
    if (
      upperMessage.includes('SUCCESSFUL') ||
      upperMessage.includes(' OK') ||
      upperMessage.includes('COMPLETED') ||
      upperMessage.includes('LISTENING')
    ) return 'text-green-400';
    if (logMessage.startsWith('$')) return 'text-blue-400';
    if (logMessage.startsWith('>')) return 'text-gray-400';
    return ''; // Inherit from parent
  };

  return (
    <div className="mt-6 space-y-6">
      <div className="rounded-lg p-[1px] bg-gradient-to-br from-primary/50 via-accent/40 to-secondary/50">
        <Card className="border-0">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>{t('servers.console.title')}</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="bg-black text-white font-mono text-sm p-4 rounded-lg h-96">
              <ScrollArea className="h-full w-full">
                {logs.map((log, index) => {
                    const colorClass = getLogColor(log.message);
                    const messageIsGood = colorClass === 'text-green-400';
                    const timeColorClass = colorClass;
                    const messageColorClass = messageIsGood ? '' : colorClass;
                    return (
                        <p key={index} className="whitespace-pre-wrap">
                            <span className={`${timeColorClass || 'text-gray-500'} mr-4`}>
                                [{log.time}]
                            </span>
                            <span className={messageColorClass}>
                              {log.message}
                            </span>
                        </p>
                    )
                })}
                <div className="flex items-center">
                    <span className="text-green-400 mr-2">$</span>
                    <div className="w-2 h-4 bg-green-400 animate-pulse"></div>
                </div>
              </ScrollArea>
            </div>
            <div className="mt-4 flex w-full items-center space-x-2">
                <Input
                  type="text"
                  placeholder={t('servers.console.commandPlaceholder')}
                  className="font-mono"
                  value={command}
                  onChange={(e) => setCommand(e.target.value)}
                  onKeyDown={handleKeyPress}
                />
                <Button type="submit" onClick={handleSendCommand}>
                  <Send className="mr-2 h-4 w-4" />
                  {t('servers.console.sendButton')}
                </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="rounded-lg p-[1px] bg-gradient-to-br from-primary/50 via-accent/40 to-secondary/50">
        <AISummary />
      </div>
    </div>
  );
}
