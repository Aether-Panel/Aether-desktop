'use client';
import { useAuth } from '@/contexts/providers';
import { useEffect, useState } from 'react';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Copy, MoreHorizontal, PlusCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';

import { nodes as nodesData } from '@/lib/data';
import type { Node } from '@/lib/data';
import { useTranslations } from '@/contexts/translations-context';

export default function NodesPage() {
  const { role } = useAuth();
  const { t } = useTranslations();
  const [nodes, setNodes] = useState<Node[]>(nodesData);
  const [isMounted, setIsMounted] = useState(false);
  const [useDifferentHost, setUseDifferentHost] = useState(false);
  const { toast } = useToast();

  // Edit state
  const [editingNode, setEditingNode] = useState<Node | null>(null);
  const [editName, setEditName] = useState('');
  const [editPublicHost, setEditPublicHost] = useState('');
  const [editPublicPort, setEditPublicPort] = useState('8080');
  const [editSftpPort, setEditSftpPort] = useState('5657');
  const [editUseDifferentHost, setEditUseDifferentHost] = useState(false);
  const [editPrivateHost, setEditPrivateHost] = useState('');
  const [editPrivatePort, setEditPrivatePort] = useState('8080');

  // Deploy state
  const [deployingNode, setDeployingNode] = useState<Node | null>(null);

  useEffect(() => {
    setIsMounted(true);
    if (role && role !== 'admin') {
      window.location.href = '/dashboard';
    }
  }, [role]);

  useEffect(() => {
    if (editingNode) {
      setEditName(editingNode.name);
      setEditPublicHost(editingNode.publicHost);
      setEditPublicPort(String(editingNode.publicPort));
      setEditSftpPort(String(editingNode.sftpPort));
      setEditUseDifferentHost(editingNode.useDifferentHost);
      setEditPrivateHost(editingNode.privateHost || '');
      setEditPrivatePort(String(editingNode.privatePort || '8080'));
    }
  }, [editingNode]);

  const handleUpdateNode = () => {
    if (!editingNode) return;
    setNodes(nodes.map(n =>
      n.id === editingNode.id
        ? {
          ...n,
          name: editName,
          publicHost: editPublicHost,
          publicPort: parseInt(editPublicPort, 10),
          sftpPort: parseInt(editSftpPort, 10),
          useDifferentHost: editUseDifferentHost,
          privateHost: editUseDifferentHost ? editPrivateHost : undefined,
          privatePort: editUseDifferentHost ? parseInt(editPrivatePort, 10) : undefined,
        }
        : n
    ));
    setEditingNode(null);
  };

  const StatusIndicator = ({ status }: { status: Node['status'] }) => {
    const statusClasses = {
      online: 'bg-green-500',
      offline: 'bg-red-500',
      deploying: 'bg-yellow-500 animate-pulse',
    };
    return <div className={`mr-2 h-2.5 w-2.5 rounded-full ${statusClasses[status]}`} />;
  };

  const CopyableCode = ({ command }: { command: string }) => {
    const handleCopy = () => {
      navigator.clipboard.writeText(command);
      toast({ title: t('common.copied') });
    };

    return (
      <div className="flex items-center gap-2 rounded-md bg-muted p-2 my-2 font-mono text-sm">
        <pre className="flex-grow overflow-x-auto"><code>{command}</code></pre>
        <Button variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0" onClick={handleCopy}>
          <Copy className="h-4 w-4" />
          <span className="sr-only">{t('common.copy')}</span>
        </Button>
      </div>
    );
  };

  const deployConfigJson = deployingNode ? JSON.stringify({
    "logs": "/var/log/AetherPanel",
    "web": {
      "host": "0.0.0.0:8080"
    },
    "token": {
      "public": "http://192.168.0.12:8080/auth/publickey"
    },
    "panel": {
      "enable": false
    },
    "daemon": {
      "auth": {
        "url": "http://192.168.0.12:8080/oauth2/token",
        "clientId": `.node_${deployingNode.id.split('-')[1]}`,
        "clientSecret": "7bdb03bbfbd44aeda8e2a4fc52035c38",
        "publicKey": ""
      },
      "data": {
        "root": "/var/lib/AetherPanel"
      },
      "sftp": {
        "host": `0.0.0.0:${deployingNode.sftpPort}`
      }
    }
  }, null, 2) : '';

  if (!isMounted || role !== 'admin') {
    return (
      <div className="flex h-full items-center justify-center">
        <p>{t('common.loading')}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <PageHeader title={t('nodes.title')} description={t('nodes.description')}>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2" />
              {t('nodes.addNode')}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle>{t('nodes.addDialog.title')}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-6 py-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="node-name">{t('nodes.addDialog.nameLabel')}</Label>
                  <Input id="node-name" placeholder={t('nodes.addDialog.namePlaceholder')} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="public-host">{t('nodes.addDialog.publicHostLabel')}</Label>
                  <Input id="public-host" placeholder={t('nodes.addDialog.publicHostPlaceholder')} />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="public-port">{t('nodes.addDialog.publicPortLabel')}</Label>
                  <Input id="public-port" type="number" defaultValue="8080" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sftp-port">{t('nodes.addDialog.sftpPortLabel')}</Label>
                  <Input id="sftp-port" type="number" defaultValue="5657" />
                </div>
              </div>
              <div className="items-top flex space-x-2">
                <Checkbox
                  id="use-different-host"
                  checked={useDifferentHost}
                  onCheckedChange={(checked) => setUseDifferentHost(Boolean(checked))}
                />
                <div className="grid gap-1.5 leading-none">
                  <label
                    htmlFor="use-different-host"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {t('nodes.addDialog.useDifferentHostLabel')}
                  </label>
                  <p className="text-sm text-muted-foreground">
                    {t('nodes.addDialog.useDifferentHostDescription')}
                  </p>
                </div>
              </div>
              {useDifferentHost && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 rounded-md border bg-muted/50 p-4 animate-in fade-in">
                  <div className="space-y-2">
                    <Label htmlFor="private-host">{t('nodes.addDialog.privateHostLabel')}</Label>
                    <Input id="private-host" placeholder={t('nodes.addDialog.privateHostPlaceholder')} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="private-port">{t('nodes.addDialog.privatePortLabel')}</Label>
                    <Input id="private-port" type="number" defaultValue="8080" />
                  </div>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button type="submit">{t('nodes.addDialog.createButton')}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </PageHeader>

      <div className="rounded-lg p-[1px] bg-gradient-to-br from-primary/50 via-accent/40 to-secondary/50">
        <Card className="border-0">
          <CardHeader>
            <CardTitle>{t('nodes.allNodes')}</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('nodes.table.name')}</TableHead>
                  <TableHead className="hidden sm:table-cell">{t('nodes.table.location')}</TableHead>
                  <TableHead>{t('dashboard.table.status')}</TableHead>
                  <TableHead className="text-right">{t('dashboard.table.actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {nodes.map((node) => (
                  <TableRow key={node.id}>
                    <TableCell className="font-medium">
                      <a href={`/nodes/${node.id}`} className="hover:underline">
                        {node.name}
                      </a>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">{node.location}</TableCell>
                    <TableCell>
                      <Badge variant={node.status === 'online' ? 'default' : node.status === 'offline' ? 'destructive' : 'secondary'} className="capitalize flex items-center gap-2 w-fit">
                        <StatusIndicator status={node.status} />
                        {t(`dashboard.status.${node.status}`)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>{t('servers.actions.menuLabel')}</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => setTimeout(() => setEditingNode(node))}>{t('nodes.actions.edit')}</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setDeployingNode(node)}>{t('nodes.actions.deploy')}</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-500">{t('nodes.actions.delete')}</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
      {/* Edit Node Dialog */}
      <Dialog open={!!editingNode} onOpenChange={(isOpen) => !isOpen && setEditingNode(null)}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{t('nodes.editDialog.title')}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-6 py-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-node-name">{t('nodes.addDialog.nameLabel')}</Label>
                <Input id="edit-node-name" value={editName} onChange={(e) => setEditName(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-public-host">{t('nodes.addDialog.publicHostLabel')}</Label>
                <Input id="edit-public-host" value={editPublicHost} onChange={(e) => setEditPublicHost(e.target.value)} />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-public-port">{t('nodes.addDialog.publicPortLabel')}</Label>
                <Input id="edit-public-port" type="number" value={editPublicPort} onChange={(e) => setEditPublicPort(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-sftp-port">{t('nodes.addDialog.sftpPortLabel')}</Label>
                <Input id="edit-sftp-port" type="number" value={editSftpPort} onChange={(e) => setEditSftpPort(e.target.value)} />
              </div>
            </div>
            <div className="items-top flex space-x-2">
              <Checkbox
                id="edit-use-different-host"
                checked={editUseDifferentHost}
                onCheckedChange={(checked) => setEditUseDifferentHost(Boolean(checked))}
              />
              <div className="grid gap-1.5 leading-none">
                <label
                  htmlFor="edit-use-different-host"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {t('nodes.addDialog.useDifferentHostLabel')}
                </label>
                <p className="text-sm text-muted-foreground">
                  {t('nodes.addDialog.useDifferentHostDescription')}
                </p>
              </div>
            </div>
            {editUseDifferentHost && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 rounded-md border bg-muted/50 p-4 animate-in fade-in">
                <div className="space-y-2">
                  <Label htmlFor="edit-private-host">{t('nodes.addDialog.privateHostLabel')}</Label>
                  <Input id="edit-private-host" value={editPrivateHost} onChange={(e) => setEditPrivateHost(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-private-port">{t('nodes.addDialog.privatePortLabel')}</Label>
                  <Input id="edit-private-port" type="number" value={editPrivatePort} onChange={(e) => setEditPrivatePort(e.target.value)} />
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingNode(null)}>{t('nodes.editDialog.cancel')}</Button>
            <Button type="submit" onClick={handleUpdateNode}>{t('nodes.editDialog.save')}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* Deploy Node Dialog */}
      <Dialog open={!!deployingNode} onOpenChange={(isOpen) => !isOpen && setDeployingNode(null)}>
        <DialogContent className="sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>{t('nodes.deployDialog.title', { name: deployingNode?.name || '' })}</DialogTitle>
            <DialogDescription>
              {t('nodes.deployDialog.description')}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 max-h-[70vh] overflow-y-auto pr-4 space-y-6">
            {/* Step 1 */}
            <div className="flex gap-4 items-start">
              <div className="flex-shrink-0 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold mt-1">1</div>
              <div>
                <h4 className="font-semibold">{t('nodes.deployDialog.step1')}</h4>
                <p className="text-sm text-muted-foreground">{t('nodes.deployDialog.step1Description')}</p>
              </div>
            </div>
            {/* Step 2 */}
            <div className="flex gap-4 items-start">
              <div className="flex-shrink-0 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold mt-1">2</div>
              <div>
                <h4 className="font-semibold">{t('nodes.deployDialog.step2')}</h4>
                <p className="text-sm text-muted-foreground">{t('nodes.deployDialog.step2Description')}</p>
                <CopyableCode command="sudo systemctl stop AetherPanel" />
              </div>
            </div>
            {/* Step 3 */}
            <div className="flex gap-4 items-start">
              <div className="flex-shrink-0 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold mt-1">3</div>
              <div>
                <h4 className="font-semibold">{t('nodes.deployDialog.step3')}</h4>
                <p className="text-sm text-muted-foreground" dangerouslySetInnerHTML={{ __html: t('nodes.deployDialog.step3Description') }}></p>
                <CopyableCode command={deployConfigJson} />
              </div>
            </div>
            {/* Step 4 */}
            <div className="flex gap-4 items-start">
              <div className="flex-shrink-0 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold mt-1">4</div>
              <div>
                <h4 className="font-semibold">{t('nodes.deployDialog.step4')}</h4>
                <p className="text-sm text-muted-foreground">{t('nodes.deployDialog.step4Description')}</p>
                <CopyableCode command="sudo systemctl enable --now AetherPanel" />
                <p className="mt-4 text-sm font-semibold text-green-500">{t('nodes.deployDialog.successMessage')}</p>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeployingNode(null)}>{t('nodes.deployDialog.close')}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
