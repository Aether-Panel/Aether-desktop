'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Folder, File as FileIcon, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';

const fileContentSamples = {
  'next.config.js': `/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['placehold.co'],
  },
}

module.exports = nextConfig`,
  'package.json': `{
  "name": "server-dashboard",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "next": "13.4.19",
    "react": "18.2.0",
    "react-dom": "18.2.0"
  }
}`,
  '.env.local': `DATABASE_URL="postgresql://user:password@localhost:5432/mydb"
NEXT_PUBLIC_API_URL="http://localhost:3000/api"`,
  'README.md': `# My Project

This is a Next.js application.

## Getting Started

First, run the development server:

\`\`\`bash
npm run dev
# or
yarn dev
\`\`\``
};

type FileItem = {
    name: string;
    type: 'folder' | 'file';
    size: string;
    modified: string;
    content?: string;
};

const files: FileItem[] = [
  { name: 'app', type: 'folder', size: '4.1 MB', modified: '2 hours ago' },
  { name: 'public', type: 'folder', size: '1.2 MB', modified: '3 days ago' },
  { name: '.env.local', type: 'file', size: '0.5 KB', modified: '1 hour ago', content: fileContentSamples['.env.local'] },
  { name: 'next.config.js', type: 'file', size: '1.2 KB', modified: '5 hours ago', content: fileContentSamples['next.config.js'] },
  { name: 'package.json', type: 'file', size: '2.5 KB', modified: '1 day ago', content: fileContentSamples['package.json'] },
  { name: 'README.md', type: 'file', size: '0.8 KB', modified: '1 week ago', content: fileContentSamples['README.md'] },
];

export default function FileManagerView() {
  const [editingFile, setEditingFile] = useState<FileItem | null>(null);

  const handleFileClick = (file: FileItem) => {
    if (file.type === 'file') {
      setEditingFile(file);
    }
  };

  return (
    <>
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>File Manager</CardTitle>
          <CardDescription>Browse and manage files on this server. Click on a file name to edit it.</CardDescription>
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
                  <TableCell
                    className={`font-medium flex items-center gap-2 ${file.type === 'file' ? 'cursor-pointer hover:underline' : ''}`}
                    onClick={() => handleFileClick(file)}
                  >
                    {file.type === 'folder' ? <Folder className="text-yellow-500" /> : <FileIcon />}
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
                        {file.type === 'file' && <DropdownMenuItem onClick={() => handleFileClick(file)}>Edit</DropdownMenuItem>}
                        <DropdownMenuItem>Download</DropdownMenuItem>
                        <DropdownMenuItem>Rename</DropdownMenuItem>
                        <DropdownMenuItem className="text-red-500">Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={!!editingFile} onOpenChange={(open) => !open && setEditingFile(null)}>
        <DialogContent className="max-w-4xl h-[80vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>Editing: {editingFile?.name}</DialogTitle>
            <DialogDescription>
              This is a mock editor. Changes will not be saved.
            </DialogDescription>
          </DialogHeader>
          <Textarea
            key={editingFile?.name}
            defaultValue={editingFile?.content ?? ''}
            className="flex-grow font-mono text-sm resize-none"
          />
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setEditingFile(null)}>
              Cancel
            </Button>
            <Button onClick={() => setEditingFile(null)}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
