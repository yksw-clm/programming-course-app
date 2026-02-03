'use client';

import { useState, useRef } from 'react'; // useRefを追加

interface CodeBlockProps {
  children?: React.ReactNode;
  className?: string;
  [key: string]: any;
}

export function CodeBlock({ children, className, ...props }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const preRef = useRef<HTMLPreElement>(null); // preタグへの参照を作成

  const handleCopy = async () => {
    // DOMから直接テキストを取得するため、複雑な構造でも見たままのコードが取れます
    if (!preRef.current) return;
    const code = preRef.current.textContent || '';
    
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
      {/* refを割り当てる */}
      <pre ref={preRef} className={className} {...props}>
        {children}
      </pre>
    </div>
  );
}