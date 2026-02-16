'use client';

import { useState } from 'react';
import { summarizeServerAlerts } from '@/ai/flows/summarize-server-alerts';
import { generateTroubleshootingTips } from '@/ai/flows/generate-troubleshooting-tips';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, Lightbulb, ListChecks, Loader2, Sparkles } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

type AISummaryProps = {
  alerts: string[];
};

export default function AISummary({ alerts }: AISummaryProps) {
  const [summary, setSummary] = useState('');
  const [tips, setTips] = useState<{ suggestions: string[]; rootCauses: string[] } | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSummarize = async () => {
    const logs = alerts.join('\n');
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
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Lightbulb className="text-primary" />
          <CardTitle>AI Console Analysis</CardTitle>
        </div>
        <CardDescription>
          Analyze the console output above to get an AI-powered summary and troubleshooting tips.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <Button onClick={handleSummarize} disabled={loading || alerts.length === 0}>
          {loading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Sparkles className="mr-2 h-4 w-4" />
          )}
          Analyze Console
        </Button>

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
  );
}
