'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { users as allUsers } from '@/lib/data';
import type { User } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useTranslations } from '@/contexts/translations-context';

type UsersViewProps = {
  serverId: string;
};

export default function UsersView({ serverId }: UsersViewProps) {
  const usersWithAccess = allUsers.filter(user => user.assignedServers.includes(serverId));
  const { t } = useTranslations();

  return (
    <div className="mt-6 rounded-lg p-[1px] bg-gradient-to-br from-primary/50 via-accent/40 to-secondary/50">
      <Card className="border-0">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{t('servers.users.title')}</CardTitle>
              <CardDescription>{t('servers.users.description')}</CardDescription>
            </div>
             <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <PlusCircle className="mr-2" />
                  {t('servers.users.addUser')}
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{t('servers.users.addDialog.title')}</DialogTitle>
                  <DialogDescription>{t('servers.users.addDialog.description')}</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="email" className="text-right">{t('servers.users.addDialog.emailLabel')}</Label>
                    <Input id="email" type="email" placeholder={t('servers.users.addDialog.emailPlaceholder')} className="col-span-3" />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">{t('servers.users.addDialog.addButton')}</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('servers.users.table.user')}</TableHead>
                <TableHead className="hidden sm:table-cell">{t('servers.users.table.email')}</TableHead>
                <TableHead className="text-right">{t('servers.users.table.actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {usersWithAccess.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={user.avatar} alt={user.name} />
                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-sm text-muted-foreground sm:hidden">{user.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">{user.email}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" className="text-red-500 hover:bg-red-500/10 hover:text-red-500">
                      {t('servers.users.revoke')}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
