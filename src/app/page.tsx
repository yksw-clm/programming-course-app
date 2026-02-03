import Link from 'next/link';
import { getPostSlugs, getPostBySlug } from '@/lib/mdx';

export default function Home() {
  const slugs = getPostSlugs();
  
  // 全ての投稿を取得してコース別に整理
  const posts = slugs.map((slug) => {
    const post = getPostBySlug(slug.replace(/\.mdx$/, ''));
    return post;
  });

  // コース別にグループ化
  const courseGroups = posts.reduce((acc, post) => {
    const courseName = post.meta.course || 'その他';
    if (!acc[courseName]) {
      acc[courseName] = [];
    }
    acc[courseName].push(post);
    return acc;
  }, {} as Record<string, typeof posts>);

  // 各コースの投稿をエピソード順にソート
  Object.keys(courseGroups).forEach((courseName) => {
    courseGroups[courseName].sort((a, b) => {
      const episodeA = a.meta.episode || 0;
      const episodeB = b.meta.episode || 0;
      return episodeA - episodeB;
    });
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* コンテナのパディングを調整 (py-8 px-4) */}
      <div className="max-w-5xl mx-auto py-8 md:py-12 px-4">
        <header className="text-center mb-10 md:mb-16">
          {/* タイトルサイズを調整 (text-3xl -> 5xl) */}
          <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
            プログラミング講座
          </h1>
          <p className="text-lg md:text-xl text-gray-600">
            基礎から学べる、わかりやすいプログラミング教材
          </p>
        </header>

        <div className="space-y-8 md:space-y-12">
          {Object.entries(courseGroups).map(([courseName, coursePosts]) => (
            <section key={courseName} className="bg-white rounded-lg shadow-md p-6 md:p-8">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 border-b-4 border-blue-500 pb-2">
                {courseName}
              </h2>
              
              <div className="grid gap-4">
                {coursePosts.map((post) => (
                  <Link
                    key={post.slug}
                    href={`/courses/${post.slug}`}
                    className="block p-4 md:p-6 border border-gray-200 rounded-lg hover:border-blue-500 hover:shadow-lg transition-all duration-200"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-2">
                          {post.meta.title}
                        </h3>
                        <p className="text-sm md:text-base text-gray-600 mb-3">
                          {post.meta.description}
                        </p>
                        <p className="text-xs md:text-sm text-gray-500">
                          {post.meta.date}
                        </p>
                      </div>
                      {post.meta.episode && (
                        <div className="ml-3 md:ml-4 flex-shrink-0">
                          <span className="inline-flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-full bg-blue-100 text-blue-700 font-bold text-base md:text-lg">
                            {post.meta.episode}
                          </span>
                        </div>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>

        <footer className="mt-12 md:mt-16 text-center text-gray-500 text-sm">
          <p>© 2026 プログラミング講座. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
}