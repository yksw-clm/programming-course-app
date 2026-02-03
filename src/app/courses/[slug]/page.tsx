import { getPostBySlug, getPostSlugs, getAdjacentPosts } from '@/lib/mdx';
import { MDXRemote } from 'next-mdx-remote/rsc';
import rehypePrettyCode from 'rehype-pretty-code';
import Link from 'next/link';

// カスタムコンポーネント（後述）
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
    <div className="flex h-screen overflow-hidden">
      {/* 左側: 記事 */}
      <article className="w-1/2 overflow-y-auto py-10 px-8 bg-white">
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

        <h1 className="text-3xl font-bold mb-4">{meta.title}</h1>
        <p className="text-gray-500 mb-8">{meta.date}</p>
        
        {/* 記事本文 */}
        <div className="prose max-w-none">
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
          <div className="mt-10 pt-6 border-t border-gray-200">
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
      <div className="w-1/2 h-full">
        <HtmlEditor />
      </div>
    </div>
  );
}