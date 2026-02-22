'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTranslations } from '@/contexts/translations-context';

const databases = [
    { name: 'db_production', user: 'prod_user', connections: 5, size: '1.2 GB' },
    { name: 'db_staging', user: 'staging_user', connections: 1, size: '450 MB' },
];

export default function DatabaseView() {
  const { t } = useTranslations();
  return (
    <div className="mt-6 rounded-lg p-[1px] bg-gradient-to-br from-primary/50 via-accent/40 to-secondary/50">
      <Card className="border-0">
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                  <CardTitle>{t('servers.database.title')}</CardTitle>
                  <CardDescription>{t('servers.database.description')}</CardDescription>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button>
                      <PlusCircle className="mr-2" />
                      {t('servers.database.newDb')}
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{t('servers.database.createDialog.title')}</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="db-name" className="text-right">
                        {t('servers.database.createDialog.nameLabel')}
                      </Label>
                      <Input id="db-name" placeholder={t('servers.database.createDialog.namePlaceholder')} className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="db-host" className="text-right">
                        {t('servers.database.createDialog.hostLabel')}
                      </Label>
                      <Select defaultValue="panel">
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder={t('servers.database.createDialog.hostPlaceholder')} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="panel">{t('servers.database.createDialog.hostLocal')}</SelectItem>
                          <SelectItem value="remote">{t('servers.database.createDialog.hostRemote')}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit">{t('servers.database.createDialog.createButton')}</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
          </div>
        </CardHeader>
        <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('servers.database.table.name')}</TableHead>
                  <TableHead className="hidden sm:table-cell">{t('servers.database.table.user')}</TableHead>
                  <TableHead className="hidden md:table-cell">{t('servers.database.table.connections')}</TableHead>
                  <TableHead className="text-right">{t('servers.database.table.size')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {databases.map((db) => (
                  <TableRow key={db.name}>
                    <TableCell>
                      <p className="font-medium">{db.name}</p>
                      <p className="text-sm text-muted-foreground sm:hidden">{db.user}</p>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">{db.user}</TableCell>
                    <TableCell className="hidden md:table-cell">
                      <Badge variant="secondary">{t('servers.database.anyHost')}</Badge>
                    </TableCell>
                    <TableCell className="text-right">{db.size}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
        </CardContent>
      </Card>
    </div>
  );
}
