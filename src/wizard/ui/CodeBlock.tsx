// Code block component with copy functionality

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { Button } from "../../components/ui/button";

export const CodeBlock = ({ label, code }: { label: string; code: string }) => {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div className="mb-6 overflow-hidden rounded-lg border border-border/50 bg-black/50 shadow-sm">
      <div className="flex items-center justify-between bg-muted/30 px-4 py-2">
        <span className="text-xs font-medium text-muted-foreground font-mono">{label}</span>
        <Button variant="ghost" size="icon" className="h-6 w-6 hover:bg-primary/10 hover:text-primary" onClick={handleCopy}>
          {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
        </Button>
      </div>
      <div className="overflow-x-auto p-4">
        <pre className="font-mono text-sm text-primary-foreground/90"><code>{code}</code></pre>
      </div>
    </div>
  );
};

