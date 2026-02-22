'use client';
import { useAuth } from '@/app/providers';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { servers as initialServers } from '@/lib/data';
import type { Server } from '@/lib/data';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, PlusCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import Link from 'next/link';
import { useTranslations } from '@/contexts/translations-context';

export default function ServersPage() {
  const { role } = useAuth();
  const router = useRouter();
  const [servers, setServers] = useState<Server[]>(initialServers);
  const [isMounted, setIsMounted] = useState(false);
  const { t } = useTranslations();

  useEffect(() => {
    setIsMounted(true);
    if (role && role !== 'admin') {
      router.push('/dashboard');
    }
  }, [role, router]);
  
  const StatusIndicator = ({ status }: { status: Server['status'] }) => {
    const statusClasses = {
      online: 'bg-green-500',
      offline: 'bg-red-500',
      pending: 'bg-yellow-500 animate-pulse',
    };
    return <div className={`mr-2 h-2.5 w-2.5 rounded-full ${statusClasses[status]}`} />;
  };

  if (!isMounted || role !== 'admin') {
    return (
      <div className="flex h-full items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <PageHeader title={t('servers.title')} description={t('servers.description')}>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2" />
              {t('servers.addServer')}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t('servers.addDialog.title')}</DialogTitle>
              <DialogDescription>{t('servers.addDialog.description')}</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">{t('servers.addDialog.nameLabel')}</Label>
                <Input id="name" defaultValue={t('servers.addDialog.namePlaceholder')} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="ip" className="text-right">{t('servers.addDialog.ipLabel')}</Label>
                <Input id="ip" defaultValue={t('servers.addDialog.ipPlaceholder')} className="col-span-3" />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">{t('servers.addDialog.createButton')}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </PageHeader>
      
      <div className="rounded-lg p-[1px] bg-gradient-to-br from-primary/50 via-accent/40 to-secondary/50">
        <Card className="border-0">
          <CardHeader>
            <CardTitle>{t('servers.allServers')}</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('servers.table.server')}</TableHead>
                  <TableHead className="hidden sm:table-cell">{t('servers.table.status')}</TableHead>
                  <TableHead className="hidden md:table-cell">{t('servers.table.cpu')}</TableHead>
                  <TableHead className="hidden md:table-cell">{t('servers.table.memory')}</TableHead>
                  <TableHead className="hidden lg:table-cell">{t('servers.table.storage')}</TableHead>
                  <TableHead className="text-right">{t('servers.table.actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {servers.map((server) => (
                  <TableRow key={server.id}>
                    <TableCell>
                      <div className="flex flex-col gap-0.5">
                        <Link href={`/servers/${server.id}`} className="font-medium hover:underline">
                          {server.name}
                        </Link>
                        <div className="text-sm text-muted-foreground font-mono">{server.ipAddress}</div>
                        <div className="sm:hidden mt-2">
                          <Badge variant={server.status === 'online' ? 'default' : server.status === 'offline' ? 'destructive' : 'secondary'} className="capitalize flex items-center gap-2 w-fit">
                            <StatusIndicator status={server.status} />
                            {t(`dashboard.status.${server.status}`)}
                          </Badge>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <Badge variant={server.status === 'online' ? 'default' : server.status === 'offline' ? 'destructive' : 'secondary'} className="capitalize flex items-center gap-2 w-fit">
                        <StatusIndicator status={server.status} />
                        {t(`dashboard.status.${server.status}`)}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <div className="flex items-center gap-2">
                        <Progress value={server.cpuUsage} className="h-2 w-20" />
                        <span>{server.cpuUsage}%</span>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <div className="flex items-center gap-2">
                        <Progress value={server.memoryUsage} className="h-2 w-20" />
                        <span>{server.memoryUsage}%</span>
                      </div>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      <div className="flex items-center gap-2">
                        <Progress value={server.storageUsage} className="h-2 w-20" />
                        <span>{server.storageUsage}%</span>
                      </div>
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
                          <DropdownMenuItem onClick={() => router.push(`/servers/${server.id}`)}>{t('servers.actions.viewDetails')}</DropdownMenuItem>
                          <DropdownMenuItem>{t('servers.actions.edit')}</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-500">{t('servers.actions.delete')}</DropdownMenuItem>
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
    </div>
  );
}
