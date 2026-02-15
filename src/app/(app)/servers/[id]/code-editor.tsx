'use client';

import { Editor, useMonaco } from '@monaco-editor/react';
import { useEffect } from 'react';
import tokyoNight from 'monaco-themes/themes/Tokyo Night.json';
import { Loader2 } from 'lucide-react';

interface CodeEditorProps {
  language: string;
  value: string;
  onChange: (value: string | undefined) => void;
}

export default function CodeEditor({ language, value, onChange }: CodeEditorProps) {
  const monaco = useMonaco();
  
  useEffect(() => {
    if (monaco) {
      monaco.editor.defineTheme('tokyo-night', tokyoNight as any);
      monaco.editor.setTheme('tokyo-night');
    }
  }, [monaco]);

  return (
    <div className="relative h-full w-full rounded-md border border-input">
      <Editor
        height="100%"
        language={language}
        value={value}
        onChange={onChange}
        theme="tokyo-night"
        loading={
          <div className="flex h-full w-full flex-col items-center justify-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-muted-foreground">Loading Editor...</p>
          </div>
        }
        options={{
          fontSize: 14,
          wordWrap: 'on',
          minimap: {
            enabled: true,
          },
          lineNumbers: 'on',
          roundedSelection: false,
          scrollBeyondLastLine: false,
          readOnly: false,
        }}
      />
    </div>
  );
}
