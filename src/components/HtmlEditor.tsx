'use client';

import { useState, useEffect, useRef } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { html } from '@codemirror/lang-html';

export function HtmlEditor() {
  const [code, setCode] = useState(``);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // コードが変更されたら、0.5秒待ってからiframeを更新する（デバウンス処理）
  // これにより、入力中のカクつきを防ぎ、無駄な更新を減らします
  useEffect(() => {
    const timer = setTimeout(() => {
      if (iframeRef.current) {
        const doc = iframeRef.current.contentDocument;
        if (doc) {
          doc.open();
          doc.write(code);
          doc.close();
        }
      }
    }, 500); // 500ミリ秒 = 0.5秒

    // 次の入力があったら前のタイマーをキャンセル
    return () => clearTimeout(timer);
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
            ref={iframeRef}
            className="w-full h-full border-0"
            title="preview"
            // srcDocは使わず、JavaScriptから書き込みます
            // allow-same-origin: これがないとJSから中身を書き換えられません
            sandbox="allow-scripts allow-same-origin"
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