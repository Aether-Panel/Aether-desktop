'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { useTranslations } from '@/contexts/translations-context';

export default function SettingsView() {
  const { t } = useTranslations();
  return (
    <div className="mt-6 rounded-lg p-[1px] bg-gradient-to-br from-primary/50 via-accent/40 to-secondary/50">
      <Card className="border-0">
        <CardHeader>
          <CardTitle>{t('servers.settings.title')}</CardTitle>
          <CardDescription>{t('servers.settings.description')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          
          <div>
            <h3 className="text-lg font-medium">{t('servers.settings.variablesTitle')}</h3>
            <Separator className="my-4" />
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="flex items-center justify-between rounded-lg border p-4 md:col-span-2">
                <div>
                  <Label htmlFor="eula" className="font-semibold">{t('servers.settings.eulaLabel')}</Label>
                  <p className="text-sm text-muted-foreground">{t('servers.settings.eulaDescription')}</p>
                </div>
                <Switch id="eula" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="file-id">{t('servers.settings.fileIdLabel')}</Label>
                <Input id="file-id" defaultValue="0" />
                <p className="text-sm text-muted-foreground">{t('servers.settings.fileIdDescription')}</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="ip">{t('servers.settings.ipLabel')}</Label>
                <Input id="ip" defaultValue="0.0.0.0" />
                <p className="text-sm text-muted-foreground">{t('servers.settings.ipDescription')}</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="java-version">{t('servers.settings.javaVersionLabel')}</Label>
                <Input id="java-version" defaultValue="21" />
                <p className="text-sm text-muted-foreground">{t('servers.settings.javaVersionDescription')}</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="memory">{t('servers.settings.memoryLabel')}</Label>
                <Input id="memory" type="number" defaultValue="1024" />
                <p className="text-sm text-muted-foreground">{t('servers.settings.memoryDescription')}</p>
              </div>
               <div className="space-y-2 md:col-span-2">
                <Label htmlFor="jvm-args">{t('servers.settings.jvmArgsLabel')}</Label>
                <Input id="jvm-args" defaultValue="-Dterminal.jline=false -Dterminal.ansi=true -Dlog4j2.formatMsgNoLookups=true" />
                <p className="text-sm text-muted-foreground">{t('servers.settings.jvmArgsDescription')}</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="port">{t('servers.settings.portLabel')}</Label>
                <Input id="port" type="number" defaultValue="25565" />
                <p className="text-sm text-muted-foreground">{t('servers.settings.portDescription')}</p>
              </div>
               <div className="space-y-2">
                <Label htmlFor="project-id">{t('servers.settings.projectIdLabel')}</Label>
                <Input id="project-id" defaultValue="0" />
                <p className="text-sm text-muted-foreground">{t('servers.settings.projectIdDescription')}</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium">{t('servers.settings.autoStartTitle')}</h3>
            <Separator className="my-4" />
            <div className="space-y-4">
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div>
                  <h3 className="font-medium">{t('servers.settings.startOnBootLabel')}</h3>
                  <p className="text-sm text-muted-foreground">{t('servers.settings.startOnBootDescription')}</p>
                </div>
                <Switch />
              </div>
              <div className="flex items-center justify-between rounded-lg border p-4">
                  <div>
                    <h3 className="font-medium">{t('servers.settings.restartOnCrashLabel')}</h3>
                    <p className="text-sm text-muted-foreground">{t('servers.settings.restartOnCrashDescription')}</p>
                  </div>
                  <Switch defaultChecked />
              </div>
               <div className="flex items-center justify-between rounded-lg border p-4">
                  <div>
                    <h3 className="font-medium">{t('servers.settings.restartOnStopLabel')}</h3>
                    <p className="text-sm text-muted-foreground">{t('servers.settings.restartOnStopDescription')}</p>
                  </div>
                  <Switch />
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium">{t('servers.settings.pluginsTitle')}</h3>
            <Separator className="my-4" />
            <div className="flex items-center justify-between rounded-lg border p-4">
                <div>
                  <h3 className="font-medium">{t('servers.settings.enablePluginsLabel')}</h3>
                  <p className="text-sm text-muted-foreground">{t('servers.settings.enablePluginsDescription')}</p>
                </div>
                <Switch />
            </div>
          </div>
          
          <div className="flex justify-end gap-2 pt-4">
              <Button>{t('servers.settings.saveButton')}</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
