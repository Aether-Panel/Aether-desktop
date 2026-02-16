'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Puzzle, Search } from 'lucide-react';

export default function PluginsView() {
  return (
    <Card className="mt-6">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Plugins</CardTitle>
            <CardDescription>0 plugins instalados</CardDescription>
          </div>
          <div className="flex w-full max-w-sm items-center space-x-2">
            <Input type="search" placeholder="Buscar plugins..." />
            <Button type="submit">
              <Search className="mr-2 h-4 w-4" />
              Buscar
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center gap-4 rounded-lg border-2 border-dashed border-muted-foreground/30 p-8 text-center">
          <Puzzle className="h-12 w-12 text-muted-foreground/50" />
          <h3 className="text-lg font-semibold">No hay plugins instalados</h3>
          <p className="text-muted-foreground">Busca e instala plugins desde el buscador.</p>
        </div>
      </CardContent>
    </Card>
  );
}
