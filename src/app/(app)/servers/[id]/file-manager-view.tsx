'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Folder, File, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

const files = [
  { name: 'app', type: 'folder', size: '4.1 MB', modified: '2 hours ago' },
  { name: 'public', type: 'folder', size: '1.2 MB', modified: '3 days ago' },
  { name: '.env.local', type: 'file', size: '0.5 KB', modified: '1 hour ago' },
  { name: 'next.config.js', type: 'file', size: '1.2 KB', modified: '5 hours ago' },
  { name: 'package.json', type: 'file', size: '2.5 KB', modified: '1 day ago' },
  { name: 'README.md', type: 'file', size: '0.8 KB', modified: '1 week ago' },
];

export default function FileManagerView() {
  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>File Manager</CardTitle>
        <CardDescription>Browse and manage files on this server.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Size</TableHead>
              <TableHead>Last Modified</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {files.map((file) => (
              <TableRow key={file.name}>
                <TableCell className="font-medium flex items-center gap-2">
                  {file.type === 'folder' ? <Folder className="text-yellow-500" /> : <File />}
                  {file.name}
                </TableCell>
                <TableCell>{file.size}</TableCell>
                <TableCell>{file.modified}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Download</DropdownMenuItem>
                      <DropdownMenuItem>Rename</DropdownMenuItem>
                      <DropdownMenuItem>Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
