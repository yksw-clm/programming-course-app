import { getPostBySlug, getPostSlugs } from '@/lib/mdx';
import { MDXRemote } from 'next-mdx-remote/rsc';
import rehypePrettyCode from 'rehype-pretty-code';

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

  return (
    <div className="flex h-screen overflow-hidden">
      {/* 左側: 記事 */}
      <article className="w-1/2 overflow-y-auto py-10 px-8 bg-white">
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
      </article>

      {/* 右側: プレビュー＆エディター */}
      <div className="w-1/2 h-full">
        <HtmlEditor />
      </div>
    </div>
  );
}