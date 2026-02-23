'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Archive, PlusCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { useTranslations } from '@/contexts/translations-context';

// This is mock data. In a real application, you'd fetch this from your server.
const initialBackups: any[] = [];

export default function BackupsView() {
  const [backupsList, setBackupsList] = useState(initialBackups);
  const { t } = useTranslations();

  return (
    <div className="mt-6 rounded-lg p-[1px] bg-gradient-to-br from-primary/50 via-accent/40 to-secondary/50">
      <Card className="border-0">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{t('servers.backups.title')}</CardTitle>
              <CardDescription>{t('servers.backups.description', { count: backupsList.length })}</CardDescription>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <PlusCircle className="mr-2" />
                  {t('servers.backups.create')}
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{t('servers.backups.createDialog.title')}</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="backup-name" className="text-right">
                      {t('servers.backups.createDialog.nameLabel')}
                    </Label>
                    <Input id="backup-name" placeholder={t('servers.backups.createDialog.namePlaceholder')} className="col-span-3" />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">{t('servers.backups.createDialog.createButton')}</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {backupsList.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-4 rounded-lg border-2 border-dashed border-muted-foreground/30 p-8 text-center">
              <Archive className="h-12 w-12 text-muted-foreground/50" />
              <h3 className="text-lg font-semibold">{t('servers.backups.empty.title')}</h3>
              <p className="text-muted-foreground">{t('servers.backups.empty.description')}</p>
            </div>
          ) : (
            // In a real app, you would map over `backupsList` and render a table or list here.
            <p>Tabla de backups...</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
