import { getPostBySlug, getPostSlugs, getAdjacentPosts } from '@/lib/mdx';
import { MDXRemote } from 'next-mdx-remote/rsc';
import rehypePrettyCode from 'rehype-pretty-code';
import Link from 'next/link';

// カスタムコンポーネント
import { Callout } from '@/components/Callout';
import { HtmlEditor } from '@/components/HtmlEditor';
import { CodeBlock } from '@/components/CodeBlock';

// 静的生成のためのパラメータ生成
export async function generateStaticParams() {
  const posts = getPostSlugs();
  return posts.map((slug) => ({
    slug: slug.replace(/\.mdx$/, ''),
  }));
}

// MDX内で使用できるコンポーネントの定義
const components = {
  Callout,
  pre: CodeBlock,
};

// コードハイライトのオプション
const options = {
  theme: 'github-dark', // または 'one-dark-pro' など
};

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { meta, content } = getPostBySlug(slug);
  const { prev, next } = getAdjacentPosts(slug);

  return (
    // Mobile: 縦並び (flex-col), 最小高さ確保
    // Desktop (lg以上): 横並び (flex-row), 画面固定 (h-screen overflow-hidden)
    <div className="flex flex-col lg:flex-row min-h-screen lg:h-screen lg:overflow-hidden">
      {/* 左側: 記事 */}
      {/* Mobile: 幅100%, 高さ自動, 全体スクロールの一部 */}
      {/* Desktop: 幅50%, 高さ100%, 内部スクロール */}
      <article className="w-full lg:w-1/2 lg:overflow-y-auto py-6 px-4 md:py-10 md:px-8 bg-white">
        {/* 戻るリンク */}
        {prev && (
          <div className="mb-6">
            <Link 
              href={`/courses/${prev.slug}`}
              className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              {prev.meta.title}
            </Link>
          </div>
        )}

        {/* フォントサイズをレスポンシブに調整 */}
        <h1 className="text-2xl md:text-3xl font-bold mb-4">{meta.title}</h1>
        <p className="text-gray-500 mb-8">{meta.date}</p>
        
        {/* 記事本文: スマホでは文字サイズを少し小さめに調整 (prose-sm) */}
        <div className="prose prose-sm md:prose-base max-w-none">
          <MDXRemote
            source={content}
            components={components}
            options={{
              mdxOptions: {
                rehypePlugins: [[rehypePrettyCode, options]],
              },
            }}
          />
        </div>

        {/* 進むリンク */}
        {next && (
          <div className="mt-10 pt-6 border-t border-gray-200 mb-8 lg:mb-0">
            <Link 
              href={`/courses/${next.slug}`}
              className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors"
            >
              {next.meta.title}
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        )}
      </article>

      {/* 右側: プレビュー＆エディター */}
      {/* Mobile: 幅100%, 高さ固定(600px)で記事の下に配置 */}
      {/* Desktop: 幅50%, 高さ100% */}
      <div className="w-full lg:w-1/2 h-[600px] lg:h-full border-t lg:border-t-0 lg:border-l border-gray-200">
        <HtmlEditor />
      </div>
    </div>
  );
}