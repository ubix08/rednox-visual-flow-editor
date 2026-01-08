import React, { useState, useEffect } from "react";
import Editor from "@monaco-editor/react";
import { Label } from "@/components/ui/label";
import { useTheme } from "@/hooks/use-theme";
interface CodeFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  language?: string;
  height?: string;
}
export function CodeField({ 
  label, 
  value, 
  onChange, 
  language = "javascript",
  height = "300px" 
}: CodeFieldProps) {
  const { isDark } = useTheme();
  const [localValue, setLocalValue] = useState(value);
  // Sync local state when external value changes (e.g., node switching)
  useEffect(() => {
    setLocalValue(value);
  }, [value]);
  // Debounced update to parent
  useEffect(() => {
    const timer = setTimeout(() => {
      if (localValue !== value) {
        onChange(localValue);
      }
    }, 800);
    return () => clearTimeout(timer);
  }, [localValue, onChange, value]);
  return (
    <div className="space-y-2">
      <Label className="text-xs font-semibold uppercase text-muted-foreground">
        {label}
      </Label>
      <div className="rounded-md border overflow-hidden">
        <Editor
          height={height}
          language={language}
          theme={isDark ? "vs-dark" : "light"}
          value={localValue}
          onChange={(v) => setLocalValue(v || "")}
          options={{
            minimap: { enabled: false },
            fontSize: 12,
            lineNumbers: "on",
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 2,
            wordWrap: "on",
            padding: { top: 8, bottom: 8 }
          }}
        />
      </div>
    </div>
  );
}