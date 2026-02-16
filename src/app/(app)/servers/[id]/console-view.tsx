'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send } from 'lucide-react';
import { useState } from 'react';

export default function ConsoleView() {
  const [logs, setLogs] = useState([
    "Starting up server...",
    "Connecting to database on port 5432.",
    "Database connection successful.",
    "Listening on port 3000.",
    "GET /api/health 200 OK",
    "GET /static/main.css 200 OK",
    "POST /api/login 200 OK",
    "User 'admin' logged in from 127.0.0.1",
    "GET /dashboard 200 OK",
    "[WARN] High memory usage detected: 85%",
    "Running scheduled job: clean_temp_files",
    "Job 'clean_temp_files' completed in 150ms.",
    "GET /api/users/1 200 OK",
    "[ERROR] Unhandled exception in worker thread: TypeError: Cannot read properties of undefined (reading 'name')",
    "Restarting worker thread...",
    "Worker thread restarted successfully."
  ]);
  const [command, setCommand] = useState('');

  const handleSendCommand = () => {
    if (command.trim() === '') return;
    const newLog = `$ ${command}`;
    const output = `> Executing: ${command}... (not actually executed)`;
    setLogs(prevLogs => [...prevLogs, newLog, output]);
    setCommand('');
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSendCommand();
    }
  };

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Live Console</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="bg-black text-white font-mono text-sm p-4 rounded-lg h-96">
          <ScrollArea className="h-full w-full">
            {logs.map((log, index) => (
              <p key={index} className="whitespace-pre-wrap">
                <span className={
                    log.startsWith('$') ? 'text-blue-400' :
                    log.includes('[ERROR]') ? 'text-red-500' : 
                    log.includes('[WARN]') ? 'text-yellow-500' : 
                    'text-green-400'
                }>
                  {`[${new Date().toLocaleTimeString()}] `}
                </span>
                {log}
              </p>
            ))}
            <div className="flex items-center">
                <span className="text-green-400 mr-2">$</span>
                <div className="w-2 h-4 bg-green-400 animate-pulse"></div>
            </div>
          </ScrollArea>
        </div>
        <div className="mt-4 flex w-full items-center space-x-2">
            <Input
              type="text"
              placeholder="Enter a command..."
              className="font-mono"
              value={command}
              onChange={(e) => setCommand(e.target.value)}
              onKeyDown={handleKeyPress}
            />
            <Button type="submit" onClick={handleSendCommand}>
              <Send className="mr-2 h-4 w-4" />
              Send
            </Button>
        </div>
      </CardContent>
    </Card>
  );
}
