'use client';

import { useState } from 'react';

interface CodeBlockProps {
  children?: React.ReactNode;
  className?: string;
  [key: string]: any;
}

export function CodeBlock({ children, className, ...props }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const extractTextFromChildren = (node: React.ReactNode): string => {
    if (typeof node === 'string') {
      return node;
    }
    if (typeof node === 'number') {
      return String(node);
    }
    if (Array.isArray(node)) {
      return node.map(extractTextFromChildren).join('');
    }
    if (node && typeof node === 'object' && 'props' in node) {
      return extractTextFromChildren((node as any).props.children);
    }
    return '';
  };

  const handleCopy = async () => {
    const code = extractTextFromChildren(children);
    
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="relative group">
      <button
        onClick={handleCopy}
        className="absolute right-2 top-2 px-3 py-1 text-xs font-medium text-white bg-gray-700 hover:bg-gray-600 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10"
        aria-label="Copy code"
      >
        {copied ? '✓ コピーしました' : 'コピー'}
      </button>
      <pre className={className} {...props}>
        {children}
      </pre>
    </div>
  );
}
