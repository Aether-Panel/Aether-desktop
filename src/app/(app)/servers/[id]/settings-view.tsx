'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';

export default function SettingsView() {
  return (
    <div className="mt-6 rounded-lg p-[1px] bg-gradient-to-br from-primary/50 via-accent/40 to-secondary/50">
      <Card className="border-0">
        <CardHeader>
          <CardTitle>Configuration</CardTitle>
          <CardDescription>Configuration and server variables</CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          
          <div>
            <h3 className="text-lg font-medium">Variables</h3>
            <Separator className="my-4" />
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="flex items-center justify-between rounded-lg border p-4 md:col-span-2">
                <div>
                  <Label htmlFor="eula" className="font-semibold">EULA Agreement</Label>
                  <p className="text-sm text-muted-foreground">Do you (or the server owner) agree to the Minecraft EULA?</p>
                </div>
                <Switch id="eula" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="file-id">File Id</Label>
                <Input id="file-id" defaultValue="0" />
                <p className="text-sm text-muted-foreground">File Id for the modpack desired. This is found at the end of the URL for the specific file desired.</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="ip">IP</Label>
                <Input id="ip" defaultValue="0.0.0.0" />
                <p className="text-sm text-muted-foreground">What IP to bind the server to.</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="java-version">Java Version</Label>
                <Input id="java-version" defaultValue="21" />
                <p className="text-sm text-muted-foreground">Version of Java to use.</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="memory">Memory (MB)</Label>
                <Input id="memory" type="number" defaultValue="1024" />
                <p className="text-sm text-muted-foreground">How much memory in MB to allocate to the Java Heap.</p>
              </div>
               <div className="space-y-2 md:col-span-2">
                <Label htmlFor="jvm-args">JVM Arguments</Label>
                <Input id="jvm-args" defaultValue="-Dterminal.jline=false -Dterminal.ansi=true -Dlog4j2.formatMsgNoLookups=true" />
                <p className="text-sm text-muted-foreground">Extra JVM arguments to pass.</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="port">Port</Label>
                <Input id="port" type="number" defaultValue="25565" />
                <p className="text-sm text-muted-foreground">What port to bind the server to.</p>
              </div>
               <div className="space-y-2">
                <Label htmlFor="project-id">Project Id</Label>
                <Input id="project-id" defaultValue="0" />
                <p className="text-sm text-muted-foreground">Project Id for the modpack desired. This is found on the modpack's webpage on the right side.</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium">Auto Start Conditions</h3>
            <Separator className="my-4" />
            <div className="space-y-4">
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div>
                  <h3 className="font-medium">Start on Boot</h3>
                  <p className="text-sm text-muted-foreground">Start the server when the node boots.</p>
                </div>
                <Switch />
              </div>
              <div className="flex items-center justify-between rounded-lg border p-4">
                  <div>
                    <h3 className="font-medium">Restart on Crash</h3>
                    <p className="text-sm text-muted-foreground">Restart the server when it crashes.</p>
                  </div>
                  <Switch defaultChecked />
              </div>
               <div className="flex items-center justify-between rounded-lg border p-4">
                  <div>
                    <h3 className="font-medium">Restart on Stop</h3>
                    <p className="text-sm text-muted-foreground">Restart the server when it is stopped.</p>
                  </div>
                  <Switch />
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium">Plugin Settings</h3>
            <Separator className="my-4" />
            <div className="flex items-center justify-between rounded-lg border p-4">
                <div>
                  <h3 className="font-medium">Enable Plugins Tab</h3>
                  <p className="text-sm text-muted-foreground">Show or hide the plugin management tab for this server.</p>
                </div>
                <Switch />
            </div>
          </div>
          
          <div className="flex justify-end gap-2 pt-4">
              <Button>Save Changes</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
