'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Puzzle, Search } from 'lucide-react';
import { useTranslations } from '@/contexts/translations-context';

export default function PluginsView() {
  const { t } = useTranslations();
  return (
    <div className="mt-6 rounded-lg p-[1px] bg-gradient-to-br from-primary/50 via-accent/40 to-secondary/50">
      <Card className="border-0">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{t('servers.plugins.title')}</CardTitle>
              <CardDescription>{t('servers.plugins.description', { count: 0 })}</CardDescription>
            </div>
            <div className="flex w-full max-w-sm items-center space-x-2">
              <Input type="search" placeholder={t('servers.plugins.searchPlaceholder')} />
              <Button type="submit">
                <Search className="mr-2 h-4 w-4" />
                {t('servers.plugins.searchButton')}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center gap-4 rounded-lg border-2 border-dashed border-muted-foreground/30 p-8 text-center">
            <Puzzle className="h-12 w-12 text-muted-foreground/50" />
            <h3 className="text-lg font-semibold">{t('servers.plugins.empty.title')}</h3>
            <p className="text-muted-foreground">{t('servers.plugins.empty.description')}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
