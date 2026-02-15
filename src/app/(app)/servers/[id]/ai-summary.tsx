'use client';

import { useState } from 'react';
import { summarizeServerAlerts } from '@/ai/flows/summarize-server-alerts';
import { generateTroubleshootingTips } from '@/ai/flows/generate-troubleshooting-tips';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { AlertCircle, Lightbulb, ListChecks, FileText, Loader2, Sparkles } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

type AISummaryProps = {
  initialAlerts: string[];
};

export default function AISummary({ initialAlerts }: AISummaryProps) {
  const [logs, setLogs] = useState(initialAlerts.join('\n\n'));
  const [summary, setSummary] = useState('');
  const [tips, setTips] = useState<{ suggestions: string[]; rootCauses: string[] } | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSummarize = async () => {
    if (!logs) return;
    setLoading(true);
    setSummary('');
    setTips(null);
    try {
      const { summary: newSummary } = await summarizeServerAlerts({ logs });
      setSummary(newSummary);

      const newTips = await generateTroubleshootingTips({ alertSummary: newSummary });
      setTips(newTips);
    } catch (error) {
      console.error('AI operation failed:', error);
      setSummary('Failed to generate summary. Please check the console for details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <FileText className="text-primary" />
            <CardTitle>AI Alert Analysis</CardTitle>
          </div>
          <CardDescription>
            Paste server logs or alerts below to get an AI-powered summary and troubleshooting tips.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Textarea
            placeholder="Paste your server logs here..."
            className="min-h-[200px] font-mono text-xs"
            value={logs}
            onChange={(e) => setLogs(e.target.value)}
          />
          <Button onClick={handleSummarize} disabled={loading || !logs}>
            {loading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="mr-2 h-4 w-4" />
            )}
            Analyze Logs
          </Button>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Lightbulb className="text-primary" />
            <CardTitle>AI Insights</CardTitle>
          </div>
          <CardDescription>Summary and suggestions will appear here after analysis.</CardDescription>
        </CardHeader>
        <CardContent>
          {loading && (
            <div className="flex flex-col items-center justify-center gap-4 py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-muted-foreground">The AI is analyzing the logs...</p>
            </div>
          )}
          {!loading && !summary && (
             <div className="flex flex-col items-center justify-center gap-4 py-8 text-center">
              <Sparkles className="h-8 w-8 text-muted-foreground" />
              <p className="text-muted-foreground">Ready to provide insights.</p>
            </div>
          )}
          {summary && (
            <div className="flex flex-col gap-6">
              <div>
                <h3 className="mb-2 font-semibold">Summary</h3>
                <p className="text-sm text-foreground/90">{summary}</p>
              </div>
              {tips && (
                <Accordion type="single" collapsible className="w-full" defaultValue="item-1">
                  <AccordionItem value="item-1">
                    <AccordionTrigger>
                      <div className="flex items-center gap-2">
                        <ListChecks />
                        <span>Troubleshooting Suggestions</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <ul className="list-disc space-y-2 pl-6">
                        {tips.suggestions.map((tip, i) => (
                          <li key={i} className="text-sm">{tip}</li>
                        ))}
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-2">
                    <AccordionTrigger>
                      <div className="flex items-center gap-2">
                        <AlertCircle />
                        <span>Potential Root Causes</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                       <ul className="list-disc space-y-2 pl-6">
                        {tips.rootCauses.map((cause, i) => (
                          <li key={i} className="text-sm">{cause}</li>
                        ))}
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
