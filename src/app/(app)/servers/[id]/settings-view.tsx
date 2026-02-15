'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';

export default function SettingsView() {
  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Server Settings</CardTitle>
        <CardDescription>Manage server configuration and behavior.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="server-name">Server Name</Label>
          <Input id="server-name" defaultValue="Production Web Server" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="ip-address">IP Address</Label>
          <Input id="ip-address" defaultValue="192.168.1.101" disabled />
        </div>
        <div className="flex items-center justify-between rounded-lg border p-4">
            <div>
              <h3 className="font-medium">Automatic Backups</h3>
              <p className="text-sm text-muted-foreground">Enable or disable daily automatic backups.</p>
            </div>
            <Switch defaultChecked />
        </div>
        <div className="flex items-center justify-between rounded-lg border p-4">
            <div>
              <h3 className="font-medium">Maintenance Mode</h3>
              <p className="text-sm text-muted-foreground">Temporarily take the server offline for maintenance.</p>
            </div>
            <Switch />
        </div>
        <div className="flex justify-end gap-2">
            <Button variant="destructive">Restart Server</Button>
            <Button>Save Changes</Button>
        </div>
      </CardContent>
    </Card>
  );
}
