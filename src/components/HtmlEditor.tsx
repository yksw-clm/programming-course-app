'use client';

import { useState, useEffect } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { html } from '@codemirror/lang-html';

export function HtmlEditor() {
  const [code, setCode] = useState(``);

  const [previewContent, setPreviewContent] = useState('');

  useEffect(() => {
    setPreviewContent(code);
  }, [code]);

  return (
    <div className="flex flex-col h-full">
      {/* プレビュー画面 */}
      <div className="h-1/2 border-b-2 border-gray-300">
        <div className="bg-gray-100 px-4 py-2 border-b border-gray-300">
          <h3 className="text-sm font-semibold text-gray-700">プレビュー</h3>
        </div>
        <div className="h-[calc(100%-40px)] bg-white overflow-auto">
          <iframe
            srcDoc={previewContent}
            className="w-full h-full border-0"
            title="preview"
            sandbox="allow-scripts"
          />
        </div>
      </div>

      {/* コードエディター */}
      <div className="h-1/2">
        <div className="bg-gray-800 px-4 py-2 border-b border-gray-700">
          <h3 className="text-sm font-semibold text-gray-200">HTMLエディター</h3>
        </div>
        <div className="h-[calc(100%-40px)] overflow-auto">
          <CodeMirror
            value={code}
            height="100%"
            extensions={[html()]}
            onChange={(value) => setCode(value)}
            theme="dark"
            basicSetup={{
              lineNumbers: true,
              highlightActiveLineGutter: true,
              highlightActiveLine: true,
              foldGutter: true,
            }}
            style={{ height: '100%', fontSize: '14px' }}
          />
        </div>
      </div>
    </div>
  );
}
