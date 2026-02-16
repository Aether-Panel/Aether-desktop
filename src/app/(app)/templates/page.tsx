'use client';
import { useAuth } from '@/app/providers';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { PageHeader } from '@/components/page-header';
import { Card, CardContent } from '@/components/ui/card';
import { FileText } from 'lucide-react';

export default function TemplatesPage() {
  const { role } = useAuth();
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    if (role && role !== 'admin') {
      router.push('/dashboard');
    }
  }, [role, router]);

  if (!isMounted || role !== 'admin') {
    return (
      <div className="flex h-full items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <PageHeader title="Template Management" description="Manage server deployment templates." />
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center gap-4 rounded-lg border-2 border-dashed border-muted-foreground/30 p-16 text-center">
            <FileText className="h-16 w-16 text-muted-foreground/50" />
            <h3 className="text-xl font-semibold">Templates Coming Soon</h3>
            <p className="text-muted-foreground">This section is under construction. Soon you'll be able to manage your server templates here.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
