'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Shield } from 'lucide-react';
import { useTranslations } from '@/contexts/translations-context';

export default function AdminView() {
  const { t } = useTranslations();
  return (
    <div className="mt-6 rounded-lg p-[1px] bg-gradient-to-br from-primary/50 via-accent/40 to-secondary/50">
      <Card className="border-0">
        <CardHeader>
          <div className="flex items-center gap-2">
              <Shield className="h-6 w-6" />
              <CardTitle>{t('servers.admin.title')}</CardTitle>
          </div>
          <CardDescription>
              {t('servers.admin.description')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between rounded-lg border p-4">
              <div>
                  <h3 className="font-medium">{t('servers.admin.editDefinition.title')}</h3>
                  <p className="text-sm text-muted-foreground">
                      {t('servers.admin.editDefinition.description')}
                  </p>
              </div>
              <Button variant="outline">{t('servers.admin.editDefinition.button')}</Button>
          </div>
          
          <div className="flex items-center justify-between rounded-lg border p-4">
              <div>
                  <h3 className="font-medium">{t('servers.admin.installStatus.title')}</h3>
                  <p className="text-sm text-muted-foreground">
                      {t('servers.admin.installStatus.description')}
                  </p>
              </div>
              <Button>{t('servers.admin.installStatus.button')}</Button>
          </div>

           <div className="flex items-center justify-between rounded-lg border border-destructive/50 bg-destructive/5 p-4">
              <div>
                  <h3 className="font-medium text-destructive">{t('servers.admin.delete.title')}</h3>
                  <p className="text-sm text-muted-foreground">
                      {t('servers.admin.delete.description')}
                  </p>
              </div>
               <AlertDialog>
                  <AlertDialogTrigger asChild>
                      <Button variant="destructive">{t('servers.admin.delete.button')}</Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                      <AlertDialogHeader>
                          <AlertDialogTitle>{t('servers.admin.deleteDialog.title')}</AlertDialogTitle>
                          <AlertDialogDescription>
                              {t('servers.admin.deleteDialog.description')}
                          </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                          <AlertDialogCancel>{t('servers.admin.deleteDialog.cancel')}</AlertDialogCancel>
                          <AlertDialogAction>{t('servers.admin.deleteDialog.confirm')}</AlertDialogAction>
                      </AlertDialogFooter>
                  </AlertDialogContent>
              </AlertDialog>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
