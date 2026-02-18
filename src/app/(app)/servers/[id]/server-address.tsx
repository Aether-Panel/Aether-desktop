'use client';
import { Copy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function ServerAddress({ ip, port }: { ip: string; port: number }) {
  const { toast } = useToast();
  const address = `${ip}:${port}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(address);
    toast({
      title: 'Copied to clipboard',
      description: `Server address ${address} copied.`,
    });
  };

  return (
    <div className="flex items-center gap-2 rounded-md bg-muted px-3 py-1.5 text-sm text-muted-foreground shadow-inner">
      <span className="font-mono">{address}</span>
      <button
        onClick={handleCopy}
        className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-background/50 hover:text-foreground"
        title="Copy address"
      >
        <Copy className="h-3 w-3" />
      </button>
    </div>
  );
}
